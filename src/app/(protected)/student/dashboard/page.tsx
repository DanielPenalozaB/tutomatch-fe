/* eslint-disable @next/next/no-img-element */
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { BookOpen, Calendar, CalendarClock, Clock, Star, Users } from 'lucide-react';
import Link from 'next/link';

const tutors = [
  {
    id: '1',
    name: 'Dr. Alex Rodriguez',
    department: 'Matemáticas',
    subjects: [ 'Cálculo', 'Algebra Lineal', 'Equaciones diferenciales' ],
    rating: 4.9,
    reviewCount: 124,
    bio: 'Doctorado en Matemáticas con más de 5 años de experiencia docente. Especializado en cálculo y ecuaciones diferenciales.',
    avatar: null,
    online: true,
    matchReason: 'Coincide con el curso en el que está inscrito MATH 201: Cálculo II'
  },
  {
    id: '2',
    name: 'Dr. Maria Gomez',
    department: 'Ciencias',
    subjects: [ 'Física', 'Química', 'Biología' ],
    rating: 4.7,
    reviewCount: 87,
    bio: 'Doctorado en Ciencias con más de 3 years de experiencia docente. Especializado en física y química.',
    avatar: null,
    online: false,
    matchReason: 'Coincide con el curso en el que está inscrito PHY 101: Física I'
  },
  {
    id: '3',
    name: 'Juan Perez',
    department: 'Matemáticas',
    subjects: [ 'Cálculo', 'Algebra Lineal', 'Equaciones diferenciales' ],
    rating: 4.5,
    reviewCount: 32,
    bio: 'Matemáticas con más de 2 years de experiencia docente. Especializado en cálculo y ecuaciones diferenciales.',
    avatar: null,
    online: true,
    matchReason: 'Coincide con el curso en el que está inscrito MATH 101: Cálculo I'
  },
  {
    id: '4',
    name: 'Ing. Manuel Gonzalez',
    department: 'Ingeniería',
    subjects: [ 'Electrónica', 'Mecánica', 'Física' ],
    rating: 4.8,
    reviewCount: 78,
    bio: 'Ingeniero con más de 4 years de experiencia docente. Especializado en electrónica y mecánica.',
    avatar: null,
    online: false,
    matchReason: 'Coincide con el curso en el que está inscrito ELE 101: Electrónica I'
  }
];

const recentSessions = [
  {
    id: '1',
    tutorName: 'Dr. Alex Rodriguez',
    subject: 'Cálculo - Límites y continiudad',
    status: 'completada',
    date: 'Mayo 2, 2025',
    time: '2:00 PM - 3:30 PM'
  },
  {
    id: '2',
    tutorName: 'Dr. Maria Gomez',
    subject: 'Física - Mecánica',
    status: 'agendada',
    date: 'Mayo 7, 2025',
    time: '10:00 AM - 11:30 AM'
  },
  {
    id: '3',
    tutorName: 'Ing. Manuel Gonzalez',
    subject: 'Electrónica - Circuitos',
    status: 'cancelada',
    date: 'Abril 30, 2025',
    time: '4:00 PM - 5:30 PM'
  }
];

export default function StudentDashboard() {
  return (
    <main className="flex flex-col gap-4 p-4">
      <div className="mb-2 flex items-center justify-between space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pr&oacute;ximas sesiones</CardTitle>
            <Calendar className="h-4 w-4 text-neutral-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-muted-foreground text-xs">Pr&oacute;xima sesi&oacute;n en 3 d&iacute;as</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sesiones completadas</CardTitle>
            <CalendarClock className="h-4 w-4 text-neutral-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10</div>
            <p className="text-muted-foreground text-xs">&Uacute;ltima sesi&oacute;n hace 3 d&iacute;as</p>
          </CardContent>
        </Card>
        <Card className="sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Asignaturas</CardTitle>
            <BookOpen className="h-4 w-4 text-neutral-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-muted-foreground text-xs">En 2 departamentos</p>
          </CardContent>
        </Card>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">Tutores recomendados</h1>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {tutors.map((tutor) => (
          <Card key={tutor.id}>
            <CardHeader>
              <div className="flex w-full items-center gap-3">
                <div className="bg-muted relative flex h-10 w-10 items-center justify-center rounded-full">
                  {tutor.avatar ? <img src={tutor.avatar || '/placeholder.svg'} alt={tutor.name} className="rounded-full object-cover" /> : <Users className="h-5 w-5" />}
                  <span className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ${tutor.online ? 'bg-green-500' : 'bg-gray-300'} ring-1 ring-white`} />
                </div>
                <div className='w-full'>
                  <CardTitle className="line-clamp-1 text-base">{tutor.name}</CardTitle>
                  <CardDescription>{tutor.department}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="text-sm">
              <div className="mb-2 flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-medium">{tutor.rating}</span>
                <span className="text-muted-foreground">({tutor.reviewCount} rese&ntilde;as)</span>
              </div>
              <p className="text-muted-foreground mb-3 line-clamp-2">{tutor.bio}</p>
              <div className="flex w-full gap-1 overflow-hidden truncate">
                {tutor.subjects.map((subject) => (
                  <Badge key={subject} variant="secondary" className="text-xs">
                    {subject}
                  </Badge>
                ))}
              </div>
              {tutor.matchReason && (
                <div className="bg-muted mt-3 rounded-md p-2 text-xs">
                  <p className="line-clamp-2"><strong>Motivo:</strong> {tutor.matchReason}</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Link href={`/student/find-tutors/${tutor.id}`}>Ver perfil</Link>
              </Button>
              <Button size="sm" className="flex-1">
                <Link href={`/student/request-session/${tutor.id}`}>Solicitar sesi&oacute;n</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">Sesiones recientes</h1>
      </div>
      <div className="space-y-4">
        {recentSessions.map((session) => (
          <Card key={session.id}>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">{session.tutorName}</h3>
                    <p className="text-muted-foreground text-sm">{session.subject}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      'px-2 py-1 rounded-full text-xs',
                      session.status === 'completada' && 'bg-green-100 text-green-800',
                      session.status === 'agendada' && 'bg-blue-100 text-blue-800',
                      session.status === 'cancelada' && 'bg-red-100 text-red-800'
                    )}
                  >
                    {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                  </div>
                  <Button variant="ghost" size="icon">
                    <Link href={`/student/my-sessions/${session.id}`}>
                      <Clock className="h-4 w-4" />
                      <span className="sr-only">Ver sesi&oacute;n</span>
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="mt-3 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="text-muted-foreground h-4 w-4" />
                  <span>{session.date}</span>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <Clock className="text-muted-foreground h-4 w-4" />
                  <span>{session.time}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
