'use client';

import { JSX, useState } from 'react';
import Link from 'next/link';
import { ArrowDown, ArrowUp, Calendar, Clock, MoreHorizontal, Star, Users, UserCheck, BookOpen, ChevronsUpDown, Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { cn } from '@/lib/utils';

const periods = [
  { value: 'week', label: 'Semana' },
  { value: 'month', label: 'Mes' },
  { value: 'semester', label: 'Semestre' },
  { value: 'anual', label: 'Año' }
];

export default function TutorDashboard() {
  const [ period, setPeriod ] = useState('month');

  return (
    <main className="flex flex-col gap-4 p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild className='min-w-40'>
              <Button variant="outline" role="combobox" className={cn('w-full justify-between', !period && 'text-muted-foreground')}>
                {period ? periods.find(({ value }) => value === period)?.label : 'Periodo'}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 drop-shadow-lg" align="start">
              <Command>
                <CommandInput placeholder="Buscar periodo..." />
                <CommandEmpty>No se encontraron periodos.</CommandEmpty>
                <CommandGroup className="max-h-60 overflow-y-auto">
                  {periods.map(({ label, value }) => (
                    <CommandItem
                      value={value}
                      key={value}
                      onSelect={() => {
                        setPeriod(value);
                      }}
                    >
                      <Check className={cn('mr-2 h-4 w-4', value === period ? 'opacity-100' : 'opacity-0')} />
                      {label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Sesiones Totales"
          value={period === 'week' ? '12' : period === 'month' ? '48' : period === 'semester' ? '124' : '156'}
          description={
            period === 'week'
              ? '2 más que la semana pasada'
              : period === 'month'
                ? '8 más que el mes pasado'
                : period === 'semester'
                  ? '15 más que el semestre pasado'
                  : '32 más que el año pasado'
          }
          trend="up"
          icon={<Calendar className="text-muted-foreground h-4 w-4" />}
        />
        <MetricCard
          title="Tasa de Asistencia"
          value={period === 'week' ? '95%' : period === 'month' ? '92%' : period === 'semester' ? '90%' : '91%'}
          description={
            period === 'week'
              ? '3% más que la semana pasada'
              : period === 'month'
                ? '1% más que el mes pasado'
                : period === 'semester'
                  ? 'Igual que el semestre pasado'
                  : '2% más que el año pasado'
          }
          trend="up"
          icon={<UserCheck className="text-muted-foreground h-4 w-4" />}
        />
        <MetricCard
          title="Puntuación de Satisfacción"
          value={period === 'week' ? '4.8' : period === 'month' ? '4.7' : period === 'semester' ? '4.6' : '4.7'}
          description={
            period === 'week'
              ? '0.2 más que la semana pasada'
              : period === 'month'
                ? '0.1 más que el mes pasado'
                : period === 'semester'
                  ? '0.1 más que el semestre pasado'
                  : 'Igual que el año pasado'
          }
          trend="up"
          icon={<Star className="text-muted-foreground h-4 w-4" />}
        />
        <MetricCard
          title="Tasa de Eficiencia"
          value={period === 'week' ? '88%' : period === 'month' ? '85%' : period === 'semester' ? '82%' : '84%'}
          description={
            period === 'week'
              ? '2% menos que la semana pasada'
              : period === 'month'
                ? '1% más que el mes pasado'
                : period === 'semester'
                  ? '3% más que el semestre pasado'
                  : '2% más que el año pasado'
          }
          trend={period === 'week' ? 'down' : 'up'}
          icon={<Clock className="text-muted-foreground h-4 w-4" />}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="p-4 md:col-span-2 lg:col-span-4">
          <CardHeader className="flex flex-row items-center justify-between p-0">
            <CardTitle className="text-base font-normal">Sesiones por Asignatura</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Abrir menú</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                <DropdownMenuItem>Descargar CSV</DropdownMenuItem>
                <DropdownMenuItem>Ver reporte detallado</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Comparar con periodo anterior</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[300px] w-full">
              <SubjectDistributionChart period={period} />
            </div>
          </CardContent>
        </Card>
        <Card className="p-4 md:col-span-2 lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between p-0">
            <CardTitle className="text-base font-normal">Horas por Modalidad</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Abrir menú</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                <DropdownMenuItem>Descargar CSV</DropdownMenuItem>
                <DropdownMenuItem>Ver reporte detallado</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Comparar con periodo anterior</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full p-0">
              <ModalityChart period={period} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="md:col-span-2 lg:col-span-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-normal">Tendencias de Rendimiento</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Abrir menú</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                <DropdownMenuItem>Descargar CSV</DropdownMenuItem>
                <DropdownMenuItem>Ver reporte detallado</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Comparar con periodo anterior</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent className="px-2">
            <div className="h-[300px] w-full">
              <PerformanceTrendChart period={period} />
            </div>
          </CardContent>
        </Card>
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle>Estudiantes Frecuentes</CardTitle>
            <CardDescription>Estudiantes con más sesiones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {frequentStudents.map((student) => (
                <div key={student.id} className="flex items-center gap-4">
                  <div className="bg-muted relative flex h-10 w-10 items-center justify-center rounded-full">
                    <Users className="h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium leading-none">{student.name}</p>
                      <p className="text-muted-foreground text-sm">{student.sessions} sesiones</p>
                    </div>
                    <div className="text-muted-foreground flex items-center text-xs">
                      <span>{student.subject}</span>
                      <span className="mx-2">•</span>
                      <span>Última sesión: {student.lastSession}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/tutor/students">Ver Todos los Estudiantes</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Próximas Sesiones</CardTitle>
            <CardDescription>Tus próximas sesiones programadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingSessions.map((session) => (
                <div key={session.id} className="flex items-start gap-4">
                  <div className="bg-muted relative flex h-10 w-10 items-center justify-center rounded-full">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium leading-none">{session.student}</p>
                      <Badge variant="outline" className="text-xs">
                        {session.type}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm">{session.subject}</p>
                    <div className="text-muted-foreground flex items-center text-xs">
                      <Calendar className="mr-1 h-3 w-3" />
                      <span>{session.date}</span>
                      <span className="mx-2">•</span>
                      <Clock className="mr-1 h-3 w-3" />
                      <span>{session.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/tutor/sessions/upcoming">Ver Todas las Próximas</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rendimiento por Asignatura</CardTitle>
            <CardDescription>Puntuaciones de satisfacción por asignatura</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {subjectPerformance.map((subject) => (
                <div key={subject.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="text-muted-foreground h-4 w-4" />
                      <span className="text-sm font-medium">{subject.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-medium">{subject.rating}</span>
                    </div>
                  </div>
                  <Progress value={subject.rating * 20} className="h-2" />
                  <p className="text-muted-foreground text-xs">
                    {subject.sessions} sesiones este {period}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/tutor/subjects">Ver Análisis de Asignaturas</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reseñas Recientes</CardTitle>
            <CardDescription>Últimos comentarios de estudiantes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReviews.map((review) => (
                <div key={review.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{review.student}</p>
                    <div className="flex items-center">
                      {[ ...Array(5) ].map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm">{review.comment}</p>
                  <div className="text-muted-foreground flex items-center text-xs">
                    <span>{review.subject}</span>
                    <span className="mx-2">•</span>
                    <span>{review.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/tutor/reviews">Ver Todas las Reseñas</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  description: string;
  trend: 'up' | 'down';
  icon: JSX.Element;
}

function MetricCard({ title, value, description, trend, icon }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-muted-foreground mt-1 flex items-center text-xs">
          {trend === 'up' ? <ArrowUp className="mr-1 h-4 w-4 text-emerald-500" /> : <ArrowDown className="mr-1 h-4 w-4 text-rose-500" />}
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

function SubjectDistributionChart({ period }: { period: string }) {
  const subjects = [
    { name: 'Cálculo', sessions: period === 'week' ? 5 : period === 'month' ? 18 : period === 'semester' ? 45 : 56 },
    {
      name: 'Álgebra Lineal',
      sessions: period === 'week' ? 3 : period === 'month' ? 12 : period === 'semester' ? 32 : 40
    },
    {
      name: 'Ecuaciones Diferenciales',
      sessions: period === 'week' ? 2 : period === 'month' ? 10 : period === 'semester' ? 28 : 35
    },
    {
      name: 'Estadística',
      sessions: period === 'week' ? 1 : period === 'month' ? 5 : period === 'semester' ? 12 : 15
    },
    {
      name: 'Matemáticas Discretas',
      sessions: period === 'week' ? 1 : period === 'month' ? 3 : period === 'semester' ? 7 : 10
    }
  ];

  const maxSessions = Math.max(...subjects.map((s) => s.sessions));

  return (
    <div className="flex flex-col space-y-4 pt-4">
      {subjects.map((subject) => (
        <div key={subject.name} className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{subject.name}</span>
            <span className="text-muted-foreground text-sm">{subject.sessions} sesiones</span>
          </div>
          <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
            <div className="bg-primary h-full" style={{ width: `${(subject.sessions / maxSessions) * 100}%` }}></div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ModalityChart({ period }: { period: string }) {
  const data = {
    online: period === 'week' ? 8 : period === 'month' ? 32 : period === 'semester' ? 85 : 105,
    presencial: period === 'week' ? 4 : period === 'month' ? 16 : period === 'semester' ? 39 : 51
  };

  const total = data.online + data.presencial;
  const onlinePercentage = Math.round((data.online / total) * 100);
  const presencialPercentage = 100 - onlinePercentage;

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="relative h-48 w-48">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold">{total}</div>
            <div className="text-muted-foreground text-xs">Horas Totales</div>
          </div>
        </div>
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="20" className="text-muted opacity-20" />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="currentColor"
            strokeWidth="20"
            strokeDasharray={`${onlinePercentage} ${presencialPercentage}`}
            className="text-primary"
          />
        </svg>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4 text-center">
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1">
            <div className="bg-primary h-3 w-3 rounded-full"></div>
            <span className="text-sm font-medium">En línea</span>
          </div>
          <p className="text-2xl font-bold">{data.online}</p>
          <p className="text-muted-foreground text-xs">horas ({onlinePercentage}%)</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1">
            <div className="bg-muted h-3 w-3 rounded-full"></div>
            <span className="text-sm font-medium">Presencial</span>
          </div>
          <p className="text-2xl font-bold">{data.presencial}</p>
          <p className="text-muted-foreground text-xs">horas ({presencialPercentage}%)</p>
        </div>
      </div>
    </div>
  );
}

function PerformanceTrendChart({ period }: { period: string }) {
  const metrics = [
    {
      name: 'Sesiones',
      icon: <Calendar className="h-4 w-4" />,
      data: period === 'week' ? [ 2, 3, 1, 2, 1, 2, 1 ]
        : period === 'month' ? [ 10, 12, 14, 12 ]
          : period === 'semester' ? [ 35, 42, 47 ]
            : [ 35, 42, 47, 32 ],
      color: 'bg-blue-500'
    },
    {
      name: 'Satisfacción',
      icon: <Star className="h-4 w-4" />,
      data: period === 'week' ? [ 4.5, 4.7, 4.8, 4.6, 4.9, 4.7, 4.8 ]
        : period === 'month' ? [ 4.6, 4.7, 4.7, 4.8 ]
          : period === 'semester' ? [ 4.5, 4.6, 4.7 ]
            : [ 4.5, 4.6, 4.7, 4.8 ],
      color: 'bg-amber-500'
    },
    {
      name: 'Eficiencia',
      icon: <Clock className="h-4 w-4" />,
      data: period === 'week' ? [ 85, 90, 88, 92, 87, 89, 88 ]
        : period === 'month' ? [ 82, 84, 85, 85 ]
          : period === 'semester' ? [ 80, 82, 84 ]
            : [ 78, 80, 82, 84 ],
      color: 'bg-emerald-500'
    }
  ];

  const labels = period === 'week'
    ? [ 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom' ]
    : period === 'month'
      ? [ 'Sem 1', 'Sem 2', 'Sem 3', 'Sem 4' ]
      : period === 'semester'
        ? [ 'Mes 1-2', 'Mes 3-4', 'Mes 5-6' ]
        : [ 'Q1', 'Q2', 'Q3', 'Q4' ];

  return (
    <div className="space-y-4 pt-4">
      <div className="flex items-center justify-between px-2">
        <div className="flex gap-4">
          {metrics.map((metric) => (
            <div key={metric.name} className="flex items-center gap-1">
              <div className={`h-3 w-3 rounded-full ${metric.color}`}></div>
              <span className="text-xs font-medium">{metric.name}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="relative h-[240px] w-full">
        {/* X-axis labels */}
        <div className="absolute bottom-0 left-0 right-0 flex h-8 justify-between px-2">
          {labels.map((label) => (
            <div key={label} className="flex-1 text-center">
              <span className="text-muted-foreground text-xs">{label}</span>
            </div>
          ))}
        </div>

        {/* Chart bars */}
        <div className="absolute bottom-8 left-0 right-0 top-0 flex gap-2 px-2">
          {labels.map((label, i) => (
            <div key={label} className="flex flex-1 items-end gap-0.5">
              {metrics.map((metric) => {
                const value = metric.data[i];
                let heightPercentage = 0;

                if (metric.name === 'Sesiones') {
                  const max = Math.max(...metric.data);
                  heightPercentage = (value / max) * 100;
                } else if (metric.name === 'Satisfacción') {
                  heightPercentage = (value / 5) * 100;
                } else {
                  heightPercentage = value;
                }

                return (
                  <div
                    key={`${metric.name}-${i}`}
                    className={`w-full ${metric.color} rounded-t-sm`}
                    style={{
                      height: `${heightPercentage}%`,
                      minHeight: '2px'
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const frequentStudents = [
  {
    id: '1',
    name: 'Emily Parker',
    subject: 'Cálculo',
    sessions: 12,
    lastSession: 'hace 2 días'
  },
  {
    id: '2',
    name: 'Michael Rodriguez',
    subject: 'Álgebra Lineal',
    sessions: 8,
    lastSession: 'hace 1 semana'
  },
  {
    id: '3',
    name: 'Sophia Chen',
    subject: 'Ecuaciones Diferenciales',
    sessions: 7,
    lastSession: 'hace 3 días'
  },
  {
    id: '4',
    name: 'James Wilson',
    subject: 'Cálculo',
    sessions: 5,
    lastSession: 'Ayer'
  }
];

const upcomingSessions = [
  {
    id: '1',
    student: 'Emily Parker',
    subject: 'Cálculo - Límites y Continuidad',
    type: 'En línea',
    date: 'Hoy',
    time: '2:00 PM - 3:30 PM'
  },
  {
    id: '2',
    student: 'Michael Rodriguez',
    subject: 'Álgebra Lineal - Matrices',
    type: 'Presencial',
    date: 'Mañana',
    time: '10:00 AM - 11:30 AM'
  },
  {
    id: '3',
    student: 'Sophia Chen',
    subject: 'Ecuaciones Diferenciales',
    type: 'En línea',
    date: '18 Mayo 2025',
    time: '1:00 PM - 2:30 PM'
  }
];

const subjectPerformance = [
  {
    name: 'Cálculo',
    rating: 4.9,
    sessions: 18
  },
  {
    name: 'Álgebra Lineal',
    rating: 4.7,
    sessions: 12
  },
  {
    name: 'Ecuaciones Diferenciales',
    rating: 4.8,
    sessions: 10
  },
  {
    name: 'Estadística',
    rating: 4.5,
    sessions: 5
  }
];

const recentReviews = [
  {
    id: '1',
    student: 'Emily Parker',
    rating: 5,
    comment: 'El Dr. Johnson explica conceptos complejos de manera fácil de entender. ¡Muy recomendado!',
    subject: 'Cálculo',
    date: 'hace 2 días'
  },
  {
    id: '2',
    student: 'Michael Rodriguez',
    rating: 4,
    comment: 'Sesión muy útil. Finalmente entiendo valores y vectores propios.',
    subject: 'Álgebra Lineal',
    date: 'hace 1 semana'
  },
  {
    id: '3',
    student: 'Sophia Chen',
    rating: 5,
    comment: '¡Excelente tutor! Paciente y conocedor. Me ayudó a resolver ecuaciones diferenciales complejas.',
    subject: 'Ecuaciones Diferenciales',
    date: 'hace 3 días'
  }
];