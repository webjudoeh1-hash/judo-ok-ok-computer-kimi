-- =========================================
-- SUPABASE BACKEND PRODUCTION SETUP
-- Academia de Judo - Scripts Completos
-- =========================================

-- ==================================================
-- 1. CREACIÓN DE ESQUEMA Y TABLAS PRINCIPALES
-- ==================================================

-- Crear esquema principal si no existe
CREATE SCHEMA IF NOT EXISTS judo_academy;

-- Establecer esquema por defecto
SET search_path TO judo_academy, public;

-- Tabla de usuarios extendida
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    belt VARCHAR(50) DEFAULT 'Blanco' CHECK (belt IN ('Blanco', 'Amarillo', 'Naranja', 'Verde', 'Azul', 'Marrón', 'Negro')),
    techniques_completed INTEGER DEFAULT 0 CHECK (techniques_completed >= 0),
    classes_attended INTEGER DEFAULT 0 CHECK (classes_attended >= 0),
    join_date DATE DEFAULT CURRENT_DATE,
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    profile_image TEXT,
    emergency_contact VARCHAR(255),
    phone VARCHAR(20),
    date_of_birth DATE,
    weight DECIMAL(5,2),
    height DECIMAL(5,2),
    medical_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de categorías de contenido
CREATE TABLE IF NOT EXISTS content_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(7) DEFAULT '#D4AF37',
    icon VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de contenidos educativos
CREATE TABLE IF NOT EXISTS content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('technique', 'theory', 'video', 'document')),
    category_id UUID REFERENCES content_categories(id) ON DELETE SET NULL,
    description TEXT NOT NULL,
    difficulty VARCHAR(20) DEFAULT 'Principiante' CHECK (difficulty IN ('Principiante', 'Intermedio', 'Avanzado')),
    duration_minutes INTEGER DEFAULT 0,
    video_url TEXT,
    document_url TEXT,
    thumbnail_url TEXT,
    tags TEXT[],
    steps TEXT[],
    prerequisites TEXT[],
    is_published BOOLEAN DEFAULT false,
    views_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de progreso de usuarios
CREATE TABLE IF NOT EXISTS user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content_id UUID NOT NULL REFERENCES content(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT false,
    favorite BOOLEAN DEFAULT false,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    notes TEXT,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, content_id)
);

-- Tabla de clases/programación
CREATE TABLE IF NOT EXISTS classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    instructor_id UUID REFERENCES users(id),
    class_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    max_students INTEGER DEFAULT 20,
    current_students INTEGER DEFAULT 0,
    level_required VARCHAR(20) DEFAULT 'Todos' CHECK (level_required IN ('Todos', 'Principiante', 'Intermedio', 'Avanzado')),
    belt_required VARCHAR(20) DEFAULT 'Todos',
    location VARCHAR(255) DEFAULT 'Dojo Principal',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de asistencia a clases
CREATE TABLE IF NOT EXISTS attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    attended BOOLEAN DEFAULT false,
    attendance_date DATE NOT NULL,
    check_in_time TIMESTAMP WITH TIME ZONE,
    check_out_time TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, class_id, attendance_date)
);

-- Tabla de logros y cinturones
CREATE TABLE IF NOT EXISTS achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('belt_promotion', 'technique_master', 'attendance', 'special')),
    belt_required VARCHAR(20),
    techniques_required INTEGER DEFAULT 0,
    attendance_required INTEGER DEFAULT 0,
    icon VARCHAR(50),
    points INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de logros de usuarios
CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    achieved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- Tabla de notificaciones
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==================================================
-- 2. FUNCIONES Y TRIGGERS
-- ==================================================

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_updated_at BEFORE UPDATE ON content 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON classes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para actualizar contadores de progreso
CREATE OR REPLACE FUNCTION update_user_progress_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.completed AND OLD.completed = false THEN
        UPDATE users 
        SET techniques_completed = techniques_completed + 1 
        WHERE id = NEW.user_id;
        
        NEW.completed_at = NOW();
    ELSIF NOT NEW.completed AND OLD.completed = true THEN
        UPDATE users 
        SET techniques_completed = techniques_completed - 1 
        WHERE id = NEW.user_id;
        
        NEW.completed_at = NULL;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar estadísticas de progreso
CREATE TRIGGER update_progress_stats
    AFTER UPDATE OF completed ON user_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_user_progress_stats();

-- Función para actualizar contadores de vistas
CREATE OR REPLACE FUNCTION increment_content_views()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE content SET views_count = views_count + 1 WHERE id = NEW.content_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función para verificar requisitos de cinturón
CREATE OR REPLACE FUNCTION check_belt_promotion_requirements()
RETURNS TRIGGER AS $$
DECLARE
    user_record RECORD;
    next_belt VARCHAR(20);
    required_techniques INTEGER;
    required_attendance INTEGER;
BEGIN
    -- Obtener datos del usuario
    SELECT * INTO user_record FROM users WHERE id = NEW.user_id;
    
    -- Determinar próximo cinturón y requisitos
    CASE user_record.belt
        WHEN 'Blanco' THEN
            next_belt := 'Amarillo';
            required_techniques := 5;
            required_attendance := 20;
        WHEN 'Amarillo' THEN
            next_belt := 'Naranja';
            required_techniques := 10;
            required_attendance := 40;
        WHEN 'Naranja' THEN
            next_belt := 'Verde';
            required_techniques := 15;
            required_attendance := 60;
        WHEN 'Verde' THEN
            next_belt := 'Azul';
            required_techniques := 20;
            required_attendance := 80;
        WHEN 'Azul' THEN
            next_belt := 'Marrón';
            required_techniques := 25;
            required_attendance := 100;
        WHEN 'Marrón' THEN
            next_belt := 'Negro';
            required_techniques := 30;
            required_attendance := 150;
        ELSE
            RETURN NEW;
    END CASE;
    
    -- Verificar si cumple requisitos para promoción
    IF user_record.techniques_completed >= required_techniques 
       AND user_record.classes_attended >= required_attendance THEN
        
        -- Crear notificación de promoción
        INSERT INTO notifications (user_id, type, title, message)
        VALUES (
            NEW.user_id, 
            'belt_promotion', 
            '¡Felicidades! Promoción de Cinturón',
            'Has cumplido los requisitos para obtener el cinturón ' || next_belt || '. Contacta con tu instructor.'
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para verificar promociones
CREATE TRIGGER check_promotion_requirements
    AFTER UPDATE OF techniques_completed, classes_attended ON users
    FOR EACH ROW
    EXECUTE FUNCTION check_belt_promotion_requirements();

-- ==================================================
-- 3. ÍNDICES PARA RENDIMIENTO
-- ==================================================

-- Índices para búsqueda rápida
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_content_type ON content(type);
CREATE INDEX IF NOT EXISTS idx_content_category ON content(category_id);
CREATE INDEX IF NOT EXISTS idx_content_published ON content(is_published) WHERE is_published = true;
CREATE INDEX IF NOT EXISTS idx_content_created_at ON content(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_content ON user_progress(content_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_completed ON user_progress(completed) WHERE completed = true;

CREATE INDEX IF NOT EXISTS idx_classes_date ON classes(class_date);
CREATE INDEX IF NOT EXISTS idx_classes_active ON classes(is_active) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_attendance_user ON attendance(user_id);
CREATE INDEX IF NOT EXISTS idx_attendance_class ON attendance(class_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(attendance_date);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read) WHERE is_read = false;

-- ==================================================
-- 4. DATOS INICIALES DE PRUEBA
-- ==================================================

-- Insertar categorías de contenido
INSERT INTO content_categories (name, description, color, icon) VALUES
('Nage-waza', 'Técnicas de proyección y lanzamiento', '#3B82F6', '🥋'),
('Katame-waza', 'Técnicas de control y inmovilización', '#10B981', '🤼'),
('Kansetsu-waza', 'Técnicas de articulaciones', '#F59E0B', '🔄'),
('Atemi-waza', 'Técnicas de golpeo preciso', '#EF4444', '⚡'),
('Ukemi', 'Técnicas de caída y seguridad', '#8B5CF6', '🛡️'),
('Filosofía', 'Principios y filosofía del Judo', '#D4AF37', '🧘');

-- Insertar usuarios de prueba
INSERT INTO users (email, name, role, belt, techniques_completed, classes_attended, password) VALUES
('admin@judoacademy.com', 'Administrador Principal', 'admin', 'Negro', 50, 200, '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj5xTz6QD1Gy'), -- admin123
('user@judoacademy.com', 'Juan Domínguez', 'user', 'Naranja', 12, 47, '$2b$12$Xj3c8nq9BWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj5xTz6QD1Gy'), -- user123
('maria@judoacademy.com', 'María Ángeles', 'user', 'Amarillo', 8, 32, '$2b$12$Yk5d2nq9BWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj5xTz6QD1Gy'); -- maria123

-- Insertar contenido de prueba
INSERT INTO content (title, type, category_id, description, difficulty, video_url, steps, tags) VALUES
('O Soto Gari - Tutorial Completo', 'technique', (SELECT id FROM content_categories WHERE name = 'Nage-waza'), 'Guía completa del lanzamiento exterior de pierna', 'Principiante', 'https://example.com/videos/osotogari.mp4', ARRAY['Coge la postura correcta', 'Agárrate a tu oponente', 'Paso hacia adelante', 'Gira y barre la pierna', 'Completa el lanzamiento'], ARRAY['técnica básica', 'proyección', 'defensa personal']),
('Ippon Seoi Nage', 'technique', (SELECT id FROM content_categories WHERE name = 'Nage-waza'), 'Lanzamiento sobre el hombro de una mano', 'Intermedio', 'https://example.com/videos/seoinage.mp4', ARRAY['Gira bajo el brazo', 'Coloca tu cadera', 'Levanta al oponente', 'Completa el lanzamiento'], ARRAY['técnica avanzada', 'proyección', 'espectacular']),
('Kesa Gatame - Control Básico', 'technique', (SELECT id FROM content_categories WHERE name = 'Katame-waza'), 'Inmovilización de la bufanda', 'Principiante', 'https://example.com/videos/kesagatame.mp4', ARRAY['Colócate lateralmente', 'Agarra el cuello', 'Controla el brazo', 'Mantén la presión'], ARRAY['inmovilización', 'control', 'suelo']),
('Fundamentos del Ukemi', 'theory', (SELECT id FROM content_categories WHERE name = 'Ukemi'), 'Aprende a caer correctamente', 'Principiante', NULL, ARRAY['Postura de seguridad', 'Rodar hacia adelante', 'Rodar hacia atrás', 'Caída lateral', 'Proteger la cabeza'], ARRAY['seguridad', 'caídas', 'fundamento']),
('Juji Gatame - Llave de Brazo', 'technique', (SELECT id FROM content_categories WHERE name = 'Kansetsu-waza'), 'Técnica de sumisión en cruz', 'Avanzado', 'https://example.com/videos/jujigatame.mp4', ARRAY['Controla el brazo', 'Coloca las piernas', 'Aplica presión', 'Mantén el control'], ARRAY['sumisión', 'llave', 'articulación']),
('Principios del Judo', 'theory', (SELECT id FROM content_categories WHERE name = 'Filosofía'), 'Los principios fundamentales del Judo', 'Principiante', NULL, ARRAY['Seiryoku Zen''yo', 'Jita Kyoei', 'Respeto', 'Disciplina', 'Mejora continua'], ARRAY['filosofía', 'principios', 'valores']);

-- Insertar logros
INSERT INTO achievements (name, description, type, belt_required, techniques_required, attendance_required, icon, points) VALUES
('Primera Técnica', 'Completa tu primera técnica', 'technique_master', 'Blanco', 1, 0, '🥋', 10),
('Principiante Dedicado', 'Completa 5 técnicas', 'technique_master', 'Blanco', 5, 0, '📚', 25),
('Asistente Regular', 'Asiste a 20 clases', 'attendance', 'Blanco', 0, 20, '📅', 30),
('Promoción Amarilla', 'Obtén el cinturón amarillo', 'belt_promotion', 'Amarillo', 5, 20, '🟡', 50),
('Técnico Intermedio', 'Completa 15 técnicas', 'technique_master', 'Naranja', 15, 0, '⭐', 75),
('Promoción Naranja', 'Obtén el cinturón naranja', 'belt_promotion', 'Naranja', 10, 40, '🟠', 100);

-- Insertar clases de prueba
INSERT INTO classes (name, description, instructor_id, class_date, start_time, end_time, level_required, max_students) VALUES
('Clase Principiantes - Nage-waza', 'Técnicas básicas de proyección', (SELECT id FROM users WHERE role = 'admin'), CURRENT_DATE + 1, '18:00:00', '19:30:00', 'Principiante', 15),
('Clase Intermedios - Katame-waza', 'Técnicas de control en el suelo', (SELECT id FROM users WHERE role = 'admin'), CURRENT_DATE + 2, '19:30:00', '21:00:00', 'Intermedio', 12),
('Clase Avanzados - Combinaciones', 'Técnicas avanzadas y combinaciones', (SELECT id FROM users WHERE role = 'admin'), CURRENT_DATE + 3, '20:00:00', '22:00:00', 'Avanzado', 10);

-- ==================================================
-- 5. CONFIGURACIÓN DE ALMACENAMIENTO
-- ==================================================

-- Crear bucket para imágenes de perfil
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) VALUES
('profile-images', 'profile-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
('content-media', 'content-media', true, 104857600, ARRAY['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm', 'application/pdf']);

-- Políticas de almacenamiento
CREATE POLICY "Users can upload own profile image" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'profile-images' AND 
        (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Users can update own profile image" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'profile-images' AND 
        (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Public can view profile images" ON storage.objects
    FOR SELECT USING (bucket_id = 'profile-images');

-- ==================================================
-- 6. FUNCIONES EDGE PARA LÓGICA DE NEGOCIO
-- ==================================================

-- Función para obtener estadísticas del dashboard
CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS TABLE (
    total_users BIGINT,
    active_users BIGINT,
    total_content BIGINT,
    published_content BIGINT,
    total_classes BIGINT,
    classes_today BIGINT,
    total_attendance BIGINT,
    new_users_this_month BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM users WHERE is_active = true) as active_users,
        (SELECT COUNT(*) FROM content) as total_content,
        (SELECT COUNT(*) FROM content WHERE is_published = true) as published_content,
        (SELECT COUNT(*) FROM classes) as total_classes,
        (SELECT COUNT(*) FROM classes WHERE class_date = CURRENT_DATE) as classes_today,
        (SELECT COUNT(*) FROM attendance WHERE attended = true) as total_attendance,
        (SELECT COUNT(*) FROM users WHERE created_at >= date_trunc('month', CURRENT_DATE)) as new_users_this_month;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener progreso detallado de usuario
CREATE OR REPLACE FUNCTION get_user_progress_detailed(user_uuid UUID)
RETURNS TABLE (
    content_id UUID,
    title VARCHAR(255),
    type VARCHAR(50),
    category_name VARCHAR(100),
    difficulty VARCHAR(20),
    completed BOOLEAN,
    favorite BOOLEAN,
    rating INTEGER,
    completed_at TIMESTAMP WITH TIME ZONE,
    progress_percentage INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id as content_id,
        c.title,
        c.type,
        cc.name as category_name,
        c.difficulty,
        COALESCE(up.completed, false) as completed,
        COALESCE(up.favorite, false) as favorite,
        up.rating,
        up.completed_at,
        CASE 
            WHEN COALESCE(up.completed, false) THEN 100
            ELSE 0
        END as progress_percentage
    FROM content c
    LEFT JOIN content_categories cc ON c.category_id = cc.id
    LEFT JOIN user_progress up ON c.id = up.content_id AND up.user_id = user_uuid
    WHERE c.is_published = true
    ORDER BY c.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para actualizar asistencia
CREATE OR REPLACE FUNCTION mark_attendance(
    p_user_id UUID,
    p_class_id UUID,
    p_attended BOOLEAN DEFAULT true
)
RETURNS VOID AS $$
DECLARE
    v_attendance_date DATE;
BEGIN
    -- Obtener fecha de la clase
    SELECT class_date INTO v_attendance_date FROM classes WHERE id = p_class_id;
    
    -- Insertar o actualizar asistencia
    INSERT INTO attendance (user_id, class_id, attendance_date, attended, check_in_time)
    VALUES (p_user_id, p_class_id, v_attendance_date, p_attended, CASE WHEN p_attended THEN NOW() ELSE NULL END)
    ON CONFLICT (user_id, class_id, attendance_date)
    DO UPDATE SET 
        attended = p_attended,
        check_in_time = CASE WHEN p_attended THEN NOW() ELSE NULL END;
    
    -- Actualizar contador de estudiantes en la clase
    IF p_attended THEN
        UPDATE classes SET current_students = current_students + 1 WHERE id = p_class_id;
        UPDATE users SET classes_attended = classes_attended + 1 WHERE id = p_user_id;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==================================================
-- 7. CONFIGURACIÓN DE AUTENTICACIÓN
-- ==================================================

-- Función para manejar nuevos usuarios
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Insertar en nuestra tabla de usuarios
    INSERT INTO judo_academy.users (id, email, name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.email)
    );
    
    -- Crear notificación de bienvenida
    INSERT INTO notifications (user_id, type, title, message)
    VALUES (
        NEW.id,
        'welcome',
        '¡Bienvenido a la Academia de Judo!',
        'Gracias por unirte a nuestra comunidad. Comienza tu camino en el arte del Judo.'
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para nuevos usuarios
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ==================================================
-- 8. POLÍTICAS DE SEGURIDAD (RLS)
-- ==================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Políticas para tabla users
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can update any user" ON users
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Políticas para tabla content
CREATE POLICY "Public can view published content" ON content
    FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can view all content" ON content
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can create content" ON content
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can update content" ON content
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can delete content" ON content
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Políticas para tabla user_progress
CREATE POLICY "Users can view own progress" ON user_progress
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "user_access_policy"
ON tu_tabla
FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Políticas para tabla classes
CREATE POLICY "Public can view active classes" ON classes
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage classes" ON classes
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Políticas para tabla attendance
CREATE POLICY "Users can view own attendance" ON attendance
    FOR SELECT USING (user_id = auth.uid());

-- Política para UPDATE (y opcionalmente DELETE)
CREATE POLICY "update_own_rows"
ON tu_tabla
FOR UPDATE
USING (user_id = auth.uid());

-- Política para INSERT
CREATE POLICY "insert_own_rows"
ON tu_tabla
FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all attendance" ON attendance
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Políticas para tabla notifications
CREATE POLICY "Users can view own notifications" ON notifications
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications" ON notifications
    FOR UPDATE USING (user_id = auth.uid());

-- Políticas para achievements (públicas)
CREATE POLICY "Public can view achievements" ON achievements
    FOR SELECT USING (true);

-- Políticas para user_achievements
CREATE POLICY "Users can view own achievements" ON user_achievements
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can manage achievements" ON user_achievements
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ==================================================
-- 9. PERMISOS Y ROLES
-- ==================================================

-- Crear rol personalizado para la aplicación
CREATE ROLE judo_app_role;

-- Otorgar permisos básicos
GRANT USAGE ON SCHEMA judo_academy TO judo_app_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA judo_academy TO judo_app_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA judo_academy TO judo_app_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA judo_academy TO judo_app_role;

-- Otorgar permisos de almacenamiento
GRANT INSERT, UPDATE, DELETE ON storage.objects TO judo_app_role;
GRANT SELECT ON storage.buckets TO judo_app_role;

-- ==================================================
-- 10. CONFIGURACIÓN FINAL
-- ==================================================

-- Comentarios descriptivos
COMMENT ON SCHEMA judo_academy IS 'Esquema principal de la Academia de Judo';
COMMENT ON TABLE users IS 'Tabla de usuarios de la academia';
COMMENT ON TABLE content IS 'Contenido educativo y técnicas de Judo';
COMMENT ON TABLE user_progress IS 'Progreso de los usuarios en el contenido';
COMMENT ON TABLE classes IS 'Clases programadas de la academia';
COMMENT ON TABLE attendance IS 'Registro de asistencia a clases';

-- Configuración de búsqueda de texto completo
CREATE INDEX IF NOT EXISTS idx_content_search ON content USING gin(to_tsvector('spanish', title || ' ' || description));
CREATE INDEX IF NOT EXISTS idx_users_search ON users USING gin(to_tsvector('spanish', name || ' ' || email));

-- Configuración de respaldo automático (si está disponible)
-- Esto dependerá de tu plan de Supabase
