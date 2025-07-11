-- Tabela de membros da igreja
CREATE TABLE public.members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  birth_date DATE,
  address TEXT,
  baptism_date DATE,
  confirmation_date DATE,
  member_since DATE DEFAULT CURRENT_DATE,
  member_status TEXT DEFAULT 'active' CHECK (member_status IN ('active', 'inactive', 'visitor')),
  photo_url TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de doações
CREATE TABLE public.donations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID REFERENCES public.members(id),
  amount DECIMAL(10,2) NOT NULL,
  donation_type TEXT DEFAULT 'tithe' CHECK (donation_type IN ('tithe', 'offering', 'campaign', 'mission')),
  campaign_name TEXT,
  payment_method TEXT DEFAULT 'cash' CHECK (payment_method IN ('cash', 'card', 'transfer', 'pix', 'stripe')),
  stripe_payment_id TEXT,
  is_recurring BOOLEAN DEFAULT false,
  recurring_frequency TEXT CHECK (recurring_frequency IN ('weekly', 'monthly', 'quarterly', 'yearly')),
  donation_date DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de reservas/agendamentos
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID REFERENCES public.members(id),
  resource_type TEXT NOT NULL CHECK (resource_type IN ('room', 'equipment', 'service')),
  resource_name TEXT NOT NULL,
  booking_type TEXT NOT NULL CHECK (booking_type IN ('wedding', 'baptism', 'funeral', 'meeting', 'event', 'counseling')),
  start_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
  end_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  description TEXT,
  notes TEXT,
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de células/grupos pequenos
CREATE TABLE public.cells (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  leader_id UUID REFERENCES public.members(id),
  co_leader_id UUID REFERENCES public.members(id),
  meeting_day TEXT,
  meeting_time TIME,
  location TEXT,
  max_members INTEGER DEFAULT 12,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de membros das células
CREATE TABLE public.cell_memberships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cell_id UUID REFERENCES public.cells(id) ON DELETE CASCADE,
  member_id UUID REFERENCES public.members(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('leader', 'co_leader', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  UNIQUE(cell_id, member_id)
);

-- Tabela de cursos da escola bíblica
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  instructor_id UUID REFERENCES public.members(id),
  duration_weeks INTEGER,
  start_date DATE,
  end_date DATE,
  meeting_day TEXT,
  meeting_time TIME,
  location TEXT,
  max_students INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de inscrições nos cursos
CREATE TABLE public.course_enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  member_id UUID REFERENCES public.members(id) ON DELETE CASCADE,
  enrollment_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completion_date TIMESTAMP WITH TIME ZONE,
  grade DECIMAL(3,1),
  certificate_issued BOOLEAN DEFAULT false,
  attendance_percentage DECIMAL(5,2),
  status TEXT DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'completed', 'dropped')),
  UNIQUE(course_id, member_id)
);

-- Tabela de voluntários
CREATE TABLE public.volunteers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID REFERENCES public.members(id) ON DELETE CASCADE,
  skills TEXT[], -- Array de habilidades
  availability_days TEXT[], -- Array de dias disponíveis
  hours_served INTEGER DEFAULT 0,
  ministry_preferences TEXT[],
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  background_check_date DATE,
  training_completed BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de escalas de ministérios
CREATE TABLE public.ministry_schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ministry_id UUID REFERENCES public.ministries(id),
  volunteer_id UUID REFERENCES public.volunteers(id),
  service_date DATE NOT NULL,
  service_time TIME,
  role TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'absent', 'completed')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de campanhas de comunicação
CREATE TABLE public.communications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  communication_type TEXT NOT NULL CHECK (communication_type IN ('email', 'sms', 'newsletter', 'announcement')),
  target_audience TEXT NOT NULL CHECK (target_audience IN ('all', 'members', 'leaders', 'volunteers', 'specific_group')),
  target_group_ids UUID[],
  scheduled_for TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sent', 'cancelled')),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cells ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cell_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ministry_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communications ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para members
CREATE POLICY "Members can view their own profile" ON public.members
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all members" ON public.members
FOR SELECT USING (is_admin(auth.uid()));

CREATE POLICY "Admins can insert members" ON public.members
FOR INSERT WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update members" ON public.members
FOR UPDATE USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete members" ON public.members
FOR DELETE USING (is_admin(auth.uid()));

-- Políticas RLS para donations
CREATE POLICY "Members can view their own donations" ON public.donations
FOR SELECT USING (
  member_id IN (SELECT m.id FROM public.members m WHERE m.user_id = auth.uid())
);

CREATE POLICY "Admins can view all donations" ON public.donations
FOR SELECT USING (is_admin(auth.uid()));

CREATE POLICY "Admins can manage donations" ON public.donations
FOR ALL USING (is_admin(auth.uid()));

-- Políticas RLS para bookings
CREATE POLICY "Members can view their own bookings" ON public.bookings
FOR SELECT USING (
  member_id IN (SELECT m.id FROM public.members m WHERE m.user_id = auth.uid())
);

CREATE POLICY "Members can create bookings" ON public.bookings
FOR INSERT WITH CHECK (
  member_id IN (SELECT m.id FROM public.members m WHERE m.user_id = auth.uid())
);

CREATE POLICY "Admins can manage all bookings" ON public.bookings
FOR ALL USING (is_admin(auth.uid()));

-- Políticas RLS para cells
CREATE POLICY "Anyone can view active cells" ON public.cells
FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage cells" ON public.cells
FOR ALL USING (is_admin(auth.uid()));

-- Políticas RLS para cell_memberships
CREATE POLICY "Members can view their cell memberships" ON public.cell_memberships
FOR SELECT USING (
  member_id IN (SELECT m.id FROM public.members m WHERE m.user_id = auth.uid())
);

CREATE POLICY "Members can join cells" ON public.cell_memberships
FOR INSERT WITH CHECK (
  member_id IN (SELECT m.id FROM public.members m WHERE m.user_id = auth.uid())
);

CREATE POLICY "Admins can manage cell memberships" ON public.cell_memberships
FOR ALL USING (is_admin(auth.uid()));

-- Políticas RLS para courses
CREATE POLICY "Anyone can view active courses" ON public.courses
FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage courses" ON public.courses
FOR ALL USING (is_admin(auth.uid()));

-- Políticas RLS para course_enrollments
CREATE POLICY "Members can view their enrollments" ON public.course_enrollments
FOR SELECT USING (
  member_id IN (SELECT m.id FROM public.members m WHERE m.user_id = auth.uid())
);

CREATE POLICY "Members can enroll in courses" ON public.course_enrollments
FOR INSERT WITH CHECK (
  member_id IN (SELECT m.id FROM public.members m WHERE m.user_id = auth.uid())
);

CREATE POLICY "Admins can manage enrollments" ON public.course_enrollments
FOR ALL USING (is_admin(auth.uid()));

-- Políticas RLS para volunteers
CREATE POLICY "Members can view their volunteer profile" ON public.volunteers
FOR SELECT USING (
  member_id IN (SELECT m.id FROM public.members m WHERE m.user_id = auth.uid())
);

CREATE POLICY "Members can create volunteer profile" ON public.volunteers
FOR INSERT WITH CHECK (
  member_id IN (SELECT m.id FROM public.members m WHERE m.user_id = auth.uid())
);

CREATE POLICY "Admins can manage volunteers" ON public.volunteers
FOR ALL USING (is_admin(auth.uid()));

-- Políticas RLS para ministry_schedules
CREATE POLICY "Volunteers can view their schedules" ON public.ministry_schedules
FOR SELECT USING (
  volunteer_id IN (SELECT v.id FROM public.volunteers v 
                   JOIN public.members m ON v.member_id = m.id 
                   WHERE m.user_id = auth.uid())
);

CREATE POLICY "Admins can manage schedules" ON public.ministry_schedules
FOR ALL USING (is_admin(auth.uid()));

-- Políticas RLS para communications
CREATE POLICY "Admins can manage communications" ON public.communications
FOR ALL USING (is_admin(auth.uid()));

-- Trigger para updated_at
CREATE TRIGGER update_members_updated_at BEFORE UPDATE ON public.members
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_donations_updated_at BEFORE UPDATE ON public.donations
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_cells_updated_at BEFORE UPDATE ON public.cells
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_volunteers_updated_at BEFORE UPDATE ON public.volunteers
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_ministry_schedules_updated_at BEFORE UPDATE ON public.ministry_schedules
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_communications_updated_at BEFORE UPDATE ON public.communications
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();