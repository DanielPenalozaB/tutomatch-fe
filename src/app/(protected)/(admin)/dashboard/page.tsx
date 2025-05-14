'use client';

import { JSX, useState } from 'react';
import Link from 'next/link';
import { ArrowDown, ArrowUp, BookOpen, Building, Calendar, Check, ChevronsUpDown, Clock, GraduationCap, MoreHorizontal, Star, Users } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverTrigger } from '@/components/ui/popover';
import { PopoverContent } from '@radix-ui/react-popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { cn } from '@/lib/utils';

const periods = [
  { value: 'week', label: 'Semana' },
  { value: 'month', label: 'Mes' },
  { value: 'semester', label: 'Semestre' },
  { value: 'anual', label: 'Año' }
];

export default function AdminDashboard() {
  const [ period, setPeriod ] = useState('month');

  return (
    <main className="flex flex-col gap-4 p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Panel de Administración</h1>
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
          value={period === 'week' ? '156' : period === 'month' ? '624' : period === 'semester' ? '1,872' : '3,744'}
          description={
            period === 'week'
              ? '12% más que la semana pasada'
              : period === 'month'
                ? '8% más que el mes pasado'
                : period === 'semester'
                  ? '15% más que el semestre pasado'
                  : '20% más que el año pasado'
          }
          trend="up"
          icon={<Calendar className="text-muted-foreground h-4 w-4" />}
        />
        <MetricCard
          title="Tutores Activos"
          value={period === 'week' ? '42' : period === 'month' ? '48' : period === 'semester' ? '52' : '58'}
          description={
            period === 'week'
              ? '3 más que la semana pasada'
              : period === 'month'
                ? '5 más que el mes pasado'
                : period === 'semester'
                  ? '7 más que el semestre pasado'
                  : '10 más que el año pasado'
          }
          trend="up"
          icon={<Users className="text-muted-foreground h-4 w-4" />}
        />
        <MetricCard
          title="Estudiantes Activos"
          value={period === 'week' ? '215' : period === 'month' ? '320' : period === 'semester' ? '450' : '520'}
          description={
            period === 'week'
              ? '15 más que la semana pasada'
              : period === 'month'
                ? '25 más que el mes pasado'
                : period === 'semester'
                  ? '50 más que el semestre pasado'
                  : '85 más que el año pasado'
          }
          trend="up"
          icon={<GraduationCap className="text-muted-foreground h-4 w-4" />}
        />
        <MetricCard
          title="Satisfacción Promedio"
          value={period === 'week' ? '4.7' : period === 'month' ? '4.6' : period === 'semester' ? '4.5' : '4.6'}
          description={
            period === 'week'
              ? '0.1 más que la semana pasada'
              : period === 'month'
                ? '0.1 más que el mes pasado'
                : period === 'semester'
                  ? 'Igual que el semestre pasado'
                  : '0.1 más que el año pasado'
          }
          trend="up"
          icon={<Star className="text-muted-foreground h-4 w-4" />}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="md:col-span-2 lg:col-span-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-normal">Actividad de la Plataforma</CardTitle>
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
              <PlatformActivityChart period={period} />
            </div>
          </CardContent>
        </Card>
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-normal">Distribución por Departamento</CardTitle>
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
            <div className="h-[300px] w-full">
              <DepartmentDistributionChart period={period} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Mejores Tutores</CardTitle>
            <CardDescription>Tutores con las calificaciones más altas y más sesiones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topTutors.map((tutor) => (
                <div key={tutor.id} className="flex items-center gap-4">
                  <div className="bg-muted relative flex h-10 w-10 items-center justify-center rounded-full">
                    <Users className="h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium leading-none">{tutor.name}</p>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span className="ml-1 text-sm font-medium">{tutor.rating}</span>
                      </div>
                    </div>
                    <div className="text-muted-foreground flex items-center text-xs">
                      <span>{tutor.department}</span>
                      <span className="mx-2">•</span>
                      <span>{tutor.sessions} sesiones</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/admin/tutors">Ver Todos los Tutores</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rendimiento por Asignatura</CardTitle>
            <CardDescription>Asignaturas más populares por cantidad de sesiones</CardDescription>
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
                    <span className="text-muted-foreground text-sm">{subject.sessions} sesiones</span>
                  </div>
                  <Progress value={subject.percentage} className="h-2" />
                  <div className="text-muted-foreground flex items-center justify-between text-xs">
                    <span>{subject.department}</span>
                    <div className="flex items-center">
                      <Star className="mr-1 h-3 w-3 fill-amber-400 text-amber-400" />
                      <span>{subject.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/admin/subjects">Ver Todas las Asignaturas</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sesiones Recientes</CardTitle>
            <CardDescription>Últimas sesiones de tutoría en la plataforma</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSessions.map((session) => (
                <div key={session.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{session.subject}</p>
                    <Badge variant={session.status === 'completed' ? 'secondary' : session.status === 'upcoming' ? 'default' : 'destructive'} className="text-xs">
                      {session.status === 'completed' ? 'Completada' : session.status === 'upcoming' ? 'Próxima' : 'Cancelada'}
                    </Badge>
                  </div>
                  <div className="text-muted-foreground flex items-center justify-between text-xs">
                    <span>Tutor: {session.tutor}</span>
                    <span>Estudiante: {session.student}</span>
                  </div>
                  <div className="text-muted-foreground flex items-center text-xs">
                    <Calendar className="mr-1 h-3 w-3" />
                    <span>{session.date}</span>
                    <span className="mx-2">•</span>
                    <Clock className="mr-1 h-3 w-3" />
                    <span>{session.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/admin/sessions">Ver Todas las Sesiones</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="departments">Departamentos</TabsTrigger>
          <TabsTrigger value="satisfaction">Satisfacción</TabsTrigger>
          <TabsTrigger value="growth">Crecimiento</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resumen de la Plataforma</CardTitle>
              <CardDescription>Métricas clave y estadísticas sobre la plataforma de tutorías</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Usuarios Totales</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border p-3 text-center">
                      <div className="text-2xl font-bold">58</div>
                      <div className="text-muted-foreground mt-1 text-xs">Tutores</div>
                    </div>
                    <div className="rounded-lg border p-3 text-center">
                      <div className="text-2xl font-bold">520</div>
                      <div className="text-muted-foreground mt-1 text-xs">Estudiantes</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Estadísticas de Sesiones</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border p-3 text-center">
                      <div className="text-2xl font-bold">3,744</div>
                      <div className="text-muted-foreground mt-1 text-xs">Sesiones Totales</div>
                    </div>
                    <div className="rounded-lg border p-3 text-center">
                      <div className="text-2xl font-bold">5,616</div>
                      <div className="text-muted-foreground mt-1 text-xs">Horas Totales</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Satisfacción</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border p-3 text-center">
                      <div className="text-2xl font-bold">4.6</div>
                      <div className="text-muted-foreground mt-1 text-xs">Calificación Promedio</div>
                    </div>
                    <div className="rounded-lg border p-3 text-center">
                      <div className="text-2xl font-bold">92%</div>
                      <div className="text-muted-foreground mt-1 text-xs">Tasa de Recomendación</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Estado de la Plataforma</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border p-3 text-center">
                      <div className="text-2xl font-bold">99.9%</div>
                      <div className="text-muted-foreground mt-1 text-xs">Disponibilidad</div>
                    </div>
                    <div className="rounded-lg border p-3 text-center">
                      <div className="text-2xl font-bold">0.5s</div>
                      <div className="text-muted-foreground mt-1 text-xs">Tiempo de Respuesta Prom.</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="mb-4 text-sm font-medium">Crecimiento Mensual</h3>
                <div className="h-[200px]">
                  <MonthlyGrowthChart />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="departments" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análisis por Departamento</CardTitle>
              <CardDescription>Métricas de rendimiento por departamento académico</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {departments.map((department) => (
                  <div key={department.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building className="text-muted-foreground h-4 w-4" />
                        <h3 className="font-medium">{department.name}</h3>
                      </div>
                      <Badge variant="outline">{department.tutors} tutores</Badge>
                    </div>
                    <Progress value={department.sessionPercentage} className="h-2" />
                    <div className="text-muted-foreground flex items-center justify-between text-sm">
                      <span>{department.sessions} sesiones</span>
                      <div className="flex items-center">
                        <Star className="mr-1 h-3 w-3 fill-amber-400 text-amber-400" />
                        <span>{department.rating} calif. prom.</span>
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {department.topSubjects.map((subject) => (
                        <Badge key={subject} variant="secondary" className="text-xs">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="satisfaction" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análisis de Satisfacción</CardTitle>
              <CardDescription>Análisis detallado de la satisfacción de los estudiantes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg border p-4 text-center">
                    <div className="text-2xl font-bold">4.6</div>
                    <div className="text-muted-foreground mt-1 text-xs">Calificación General</div>
                  </div>
                  <div className="rounded-lg border p-4 text-center">
                    <div className="text-2xl font-bold">92%</div>
                    <div className="text-muted-foreground mt-1 text-xs">Tasa de Recomendación</div>
                  </div>
                  <div className="rounded-lg border p-4 text-center">
                    <div className="text-2xl font-bold">3,120</div>
                    <div className="text-muted-foreground mt-1 text-xs">Reseñas Totales</div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-lg font-medium">Distribución de Calificaciones</h3>
                  <div className="space-y-2">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="mr-2 text-sm">5 estrellas</span>
                          <div className="flex">
                            {[ ...Array(5) ].map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                        </div>
                        <span className="text-muted-foreground text-sm">70%</span>
                      </div>
                      <Progress value={70} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="mr-2 text-sm">4 estrellas</span>
                          <div className="flex">
                            {[ ...Array(4) ].map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                            ))}
                            <Star className="text-muted-foreground h-3 w-3" />
                          </div>
                        </div>
                        <span className="text-muted-foreground text-sm">20%</span>
                      </div>
                      <Progress value={20} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="mr-2 text-sm">3 estrellas</span>
                          <div className="flex">
                            {[ ...Array(3) ].map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                            ))}
                            {[ ...Array(2) ].map((_, i) => (
                              <Star key={i} className="text-muted-foreground h-3 w-3" />
                            ))}
                          </div>
                        </div>
                        <span className="text-muted-foreground text-sm">7%</span>
                      </div>
                      <Progress value={7} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="mr-2 text-sm">2 estrellas</span>
                          <div className="flex">
                            {[ ...Array(2) ].map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                            ))}
                            {[ ...Array(3) ].map((_, i) => (
                              <Star key={i} className="text-muted-foreground h-3 w-3" />
                            ))}
                          </div>
                        </div>
                        <span className="text-muted-foreground text-sm">2%</span>
                      </div>
                      <Progress value={2} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="mr-2 text-sm">1 estrella</span>
                          <div className="flex">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            {[ ...Array(4) ].map((_, i) => (
                              <Star key={i} className="text-muted-foreground h-3 w-3" />
                            ))}
                          </div>
                        </div>
                        <span className="text-muted-foreground text-sm">1%</span>
                      </div>
                      <Progress value={1} className="h-2" />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-lg font-medium">Tendencia de Satisfacción</h3>
                  <div className="h-[200px]">
                    <SatisfactionTrendChart />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="growth" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Crecimiento de la Plataforma</CardTitle>
              <CardDescription>Crecimiento de usuarios y sesiones en el tiempo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg border p-4 text-center">
                    <div className="text-2xl font-bold">+20%</div>
                    <div className="text-muted-foreground mt-1 text-xs">Crecimiento de Sesiones (Anual)</div>
                  </div>
                  <div className="rounded-lg border p-4 text-center">
                    <div className="text-2xl font-bold">+15%</div>
                    <div className="text-muted-foreground mt-1 text-xs">Crecimiento de Estudiantes (Anual)</div>
                  </div>
                  <div className="rounded-lg border p-4 text-center">
                    <div className="text-2xl font-bold">+12%</div>
                    <div className="text-muted-foreground mt-1 text-xs">Crecimiento de Tutores (Anual)</div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-lg font-medium">Crecimiento de Usuarios</h3>
                  <div className="h-[200px]">
                    <UserGrowthChart />
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-lg font-medium">Crecimiento de Sesiones</h3>
                  <div className="h-[200px]">
                    <SessionGrowthChart />
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-lg font-medium">Crecimiento por Departamento</h3>
                  <div className="space-y-4">
                    {departments.map((department) => (
                      <div key={department.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{department.name}</span>
                          <span className="text-muted-foreground text-sm">
                            {department.growth > 0 ? '+' : ''}
                            {department.growth}%
                          </span>
                        </div>
                        <Progress value={50 + department.growth / 2} className={`h-2 ${department.growth > 0 ? 'bg-emerald-100' : department.growth < 0 ? 'bg-rose-100' : ''}`} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  description: string;
  trend?: 'up' | 'down';
  icon?: React.ReactNode;
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

function PlatformActivityChart({ period }: { period: string }) {
  const metrics = [
    {
      name: 'Sesiones',
      icon: <Calendar className="h-4 w-4" />,
      data: period === 'week' ? [ 20, 25, 22, 30, 28, 15, 16 ]
        : period === 'month' ? [ 120, 150, 180, 174 ]
          : period === 'semester' ? [ 450, 520, 580 ]
            : [ 850, 950, 1050, 894 ],
      color: 'bg-blue-500'
    },
    {
      name: 'Estudiantes Activos',
      icon: <GraduationCap className="h-4 w-4" />,
      data: period === 'week' ? [ 150, 160, 155, 170, 165, 120, 130 ]
        : period === 'month' ? [ 180, 200, 220, 210 ]
          : period === 'semester' ? [ 250, 300, 350 ]
            : [ 350, 400, 450, 520 ],
      color: 'bg-emerald-500'
    },
    {
      name: 'Tutores Activos',
      icon: <Users className="h-4 w-4" />,
      data: period === 'week' ? [ 35, 38, 36, 40, 39, 30, 32 ]
        : period === 'month' ? [ 40, 42, 45, 48 ]
          : period === 'semester' ? [ 45, 48, 52 ]
            : [ 48, 52, 55, 58 ],
      color: 'bg-amber-500'
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
    <div className="relative h-full w-full">
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
          <div key={label} className="flex flex-1 items-end gap-1">
            {metrics.map((metric) => {
              const value = metric.data[i];
              const maxValue = Math.max(...metric.data);
              const heightPercentage = (value / maxValue) * 100;

              return (
                <div
                  key={`${metric.name}-${i}`}
                  className={`w-full rounded-t-sm ${metric.color}`}
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

      {/* Legend */}
      <div className="absolute left-0 right-0 top-0 flex justify-center gap-4 pt-2">
        {metrics.map((metric) => (
          <div key={metric.name} className="flex items-center gap-1">
            <div className={`h-3 w-3 rounded-full ${metric.color}`}></div>
            <span className="text-xs font-medium">{metric.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DepartmentDistributionChart({ period }: { period: string }) {
  const departmentData = [
    {
      name: 'Matemáticas',
      sessions: period === 'week' ? 45 : period === 'month' ? 180 : period === 'semester' ? 540 : 1080,
      color: 'bg-blue-500'
    },
    {
      name: 'Ciencias de la Computación',
      sessions: period === 'week' ? 35 : period === 'month' ? 140 : period === 'semester' ? 420 : 840,
      color: 'bg-emerald-500'
    },
    {
      name: 'Física',
      sessions: period === 'week' ? 25 : period === 'month' ? 100 : period === 'semester' ? 300 : 600,
      color: 'bg-amber-500'
    },
    {
      name: 'Química',
      sessions: period === 'week' ? 20 : period === 'month' ? 80 : period === 'semester' ? 240 : 480,
      color: 'bg-rose-500'
    },
    {
      name: 'Biología',
      sessions: period === 'week' ? 15 : period === 'month' ? 60 : period === 'semester' ? 180 : 360,
      color: 'bg-purple-500'
    },
    {
      name: 'Inglés',
      sessions: period === 'week' ? 10 : period === 'month' ? 40 : period === 'semester' ? 120 : 240,
      color: 'bg-indigo-500'
    },
    {
      name: 'Historia',
      sessions: period === 'week' ? 6 : period === 'month' ? 24 : period === 'semester' ? 72 : 144,
      color: 'bg-orange-500'
    }
  ];

  const total = departmentData.reduce((sum, dept) => sum + dept.sessions, 0);

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="relative mb-6 h-48 w-48">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          {
            departmentData.reduce(
              (acc, dept) => {
                const percentage = (dept.sessions / total) * 100;
                const offset = acc.offset;
                const dashArray = `${percentage} ${100 - percentage}`;

                acc.elements.push(<circle
                  key={dept.name}
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="20"
                  strokeDasharray={dashArray}
                  strokeDashoffset={offset}
                  className={dept.color}
                />);

                acc.offset -= percentage;
                return acc;
              },
              { elements: [] as JSX.Element[], offset: 0 }
            ).elements
          }
        </svg>
      </div>

      <div className="grid w-full grid-cols-2 gap-2">
        {departmentData.map((dept) => (
          <div key={dept.name} className="flex items-center gap-1">
            <div className={`h-3 w-3 rounded-full ${dept.color}`}></div>
            <span className="text-xs">{dept.name}</span>
            <span className="text-muted-foreground ml-auto text-xs">{Math.round((dept.sessions / total) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MonthlyGrowthChart() {
  const months = [ 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic' ];
  const data = {
    sessions: [ 120, 135, 150, 165, 180, 200, 220, 240, 260, 280, 300, 320 ],
    students: [ 180, 190, 200, 210, 220, 230, 240, 250, 260, 280, 300, 320 ],
    tutors: [ 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52 ]
  };

  return (
    <div className="relative h-full w-full">
      {/* X-axis labels */}
      <div className="absolute bottom-0 left-0 right-0 flex h-8 justify-between px-2">
        {months.map((month) => (
          <div key={month} className="flex-1 text-center">
            <span className="text-muted-foreground text-xs">{month}</span>
          </div>
        ))}
      </div>

      {/* Chart bars */}
      <div className="absolute bottom-8 left-0 right-0 top-0 flex gap-1 px-2">
        {months.map((month, i) => (
          <div key={month} className="flex flex-1 items-end gap-1">
            <div className="w-full rounded-t-sm bg-blue-500" style={{ height: `${(data.sessions[i] / Math.max(...data.sessions)) * 100}%` }}></div>
            <div className="w-full rounded-t-sm bg-emerald-500" style={{ height: `${(data.students[i] / Math.max(...data.students)) * 100}%` }}></div>
            <div className="w-full rounded-t-sm bg-amber-500" style={{ height: `${(data.tutors[i] / Math.max(...data.tutors)) * 100}%` }}></div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="absolute left-0 right-0 top-0 flex justify-center gap-4 pt-2">
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded-full bg-blue-500"></div>
          <span className="text-xs font-medium">Sesiones</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
          <span className="text-xs font-medium">Estudiantes</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded-full bg-amber-500"></div>
          <span className="text-xs font-medium">Tutores</span>
        </div>
      </div>
    </div>
  );
}

function SatisfactionTrendChart() {
  const months = [ 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic' ];
  const data = [ 4.3, 4.4, 4.3, 4.5, 4.4, 4.5, 4.6, 4.5, 4.6, 4.7, 4.6, 4.7 ];

  return (
    <div className="relative h-full w-full">
      {/* X-axis labels */}
      <div className="absolute bottom-0 left-0 right-0 flex h-8 justify-between px-2">
        {months.map((month) => (
          <div key={month} className="flex-1 text-center">
            <span className="text-muted-foreground text-xs">{month}</span>
          </div>
        ))}
      </div>

      {/* Chart bars */}
      <div className="absolute bottom-8 left-0 right-0 top-0 flex gap-1 px-2">
        {months.map((month, i) => (
          <div key={month} className="flex flex-1 items-end">
            <div className="w-full rounded-t-sm bg-amber-500" style={{ height: `${(data[i] / 5) * 100}%` }}></div>
          </div>
        ))}
      </div>

      {/* Rating scale */}
      <div className="absolute left-0 right-0 top-0 flex justify-between px-2 pt-2">
        <span className="text-muted-foreground text-xs">1.0</span>
        <span className="text-muted-foreground text-xs">5.0</span>
      </div>
    </div>
  );
}

function UserGrowthChart() {
  const quarters = [ 'Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024', 'Q1 2025', 'Q2 2025' ];
  const data = {
    students: [ 250, 280, 320, 350, 420, 520 ],
    tutors: [ 30, 35, 40, 45, 50, 58 ]
  };

  return (
    <div className="relative h-full w-full">
      {/* X-axis labels */}
      <div className="absolute bottom-0 left-0 right-0 flex h-8 justify-between px-2">
        {quarters.map((quarter) => (
          <div key={quarter} className="flex-1 text-center">
            <span className="text-muted-foreground text-xs">{quarter}</span>
          </div>
        ))}
      </div>

      {/* Chart bars */}
      <div className="absolute bottom-8 left-0 right-0 top-0 flex gap-1 px-2">
        {quarters.map((quarter, i) => (
          <div key={quarter} className="flex flex-1 items-end gap-1">
            <div className="w-full rounded-t-sm bg-emerald-500" style={{ height: `${(data.students[i] / Math.max(...data.students)) * 100}%` }}></div>
            <div className="w-full rounded-t-sm bg-amber-500" style={{ height: `${(data.tutors[i] / Math.max(...data.tutors)) * 100}%` }}></div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="absolute left-0 right-0 top-0 flex justify-center gap-4 pt-2">
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
          <span className="text-xs font-medium">Estudiantes</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded-full bg-amber-500"></div>
          <span className="text-xs font-medium">Tutores</span>
        </div>
      </div>
    </div>
  );
}

function SessionGrowthChart() {
  const quarters = [ 'Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024', 'Q1 2025', 'Q2 2025' ];
  const data = [ 1800, 2100, 2400, 2700, 3200, 3744 ];

  return (
    <div className="relative h-full w-full">
      {/* X-axis labels */}
      <div className="absolute bottom-0 left-0 right-0 flex h-8 justify-between px-2">
        {quarters.map((quarter) => (
          <div key={quarter} className="flex-1 text-center">
            <span className="text-muted-foreground text-xs">{quarter}</span>
          </div>
        ))}
      </div>

      {/* Chart bars */}
      <div className="absolute bottom-8 left-0 right-0 top-0 flex gap-1 px-2">
        {quarters.map((quarter, i) => (
          <div key={quarter} className="flex flex-1 items-end">
            <div className="w-full rounded-t-sm bg-blue-500" style={{ height: `${(data[i] / Math.max(...data)) * 100}%` }}></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Datos de ejemplo
const topTutors = [
  {
    id: '1',
    name: 'Dr. Alex Johnson',
    department: 'Matemáticas',
    sessions: 124,
    rating: 4.9
  },
  {
    id: '2',
    name: 'Sarah Williams',
    department: 'Ciencias de la Computación',
    sessions: 98,
    rating: 4.8
  },
  {
    id: '3',
    name: 'Michael Chen',
    department: 'Física',
    sessions: 87,
    rating: 4.7
  },
  {
    id: '4',
    name: 'Emily Rodriguez',
    department: 'Química',
    sessions: 76,
    rating: 4.6
  },
  {
    id: '5',
    name: 'David Kim',
    department: 'Inglés',
    sessions: 65,
    rating: 4.8
  }
];

const subjectPerformance = [
  {
    name: 'Cálculo',
    department: 'Matemáticas',
    sessions: 450,
    percentage: 90,
    rating: 4.8
  },
  {
    name: 'Estructuras de Datos',
    department: 'Ciencias de la Computación',
    sessions: 380,
    percentage: 76,
    rating: 4.7
  },
  {
    name: 'Física Cuántica',
    department: 'Física',
    sessions: 320,
    percentage: 64,
    rating: 4.6
  },
  {
    name: 'Química Orgánica',
    department: 'Química',
    sessions: 280,
    percentage: 56,
    rating: 4.5
  }
];

const recentSessions = [
  {
    id: '1',
    subject: 'Cálculo - Límites y Continuidad',
    tutor: 'Dr. Alex Johnson',
    student: 'Emily Parker',
    status: 'completed',
    date: '14 Mayo 2025',
    time: '2:00 PM - 3:30 PM'
  },
  {
    id: '2',
    subject: 'Estructuras de Datos - Árboles Binarios',
    tutor: 'Sarah Williams',
    student: 'Michael Rodriguez',
    status: 'upcoming',
    date: '15 Mayo 2025',
    time: '10:00 AM - 11:30 AM'
  },
  {
    id: '3',
    subject: 'Física Cuántica - Funciones de Onda',
    tutor: 'Michael Chen',
    student: 'Sophia Chen',
    status: 'upcoming',
    date: '15 Mayo 2025',
    time: '1:00 PM - 2:30 PM'
  },
  {
    id: '4',
    subject: 'Química Orgánica - Grupos Funcionales',
    tutor: 'Emily Rodriguez',
    student: 'James Wilson',
    status: 'cancelled',
    date: '14 Mayo 2025',
    time: '4:00 PM - 5:30 PM'
  }
];

const departments = [
  {
    name: 'Matemáticas',
    tutors: 15,
    sessions: 1080,
    sessionPercentage: 90,
    rating: 4.8,
    growth: 18,
    topSubjects: [ 'Cálculo', 'Álgebra Lineal', 'Ecuaciones Diferenciales', 'Estadística' ]
  },
  {
    name: 'Ciencias de la Computación',
    tutors: 12,
    sessions: 840,
    sessionPercentage: 70,
    rating: 4.7,
    growth: 25,
    topSubjects: [ 'Estructuras de Datos', 'Algoritmos', 'Lenguajes de Programación', 'Bases de Datos' ]
  },
  {
    name: 'Física',
    tutors: 10,
    sessions: 600,
    sessionPercentage: 50,
    rating: 4.6,
    growth: 15,
    topSubjects: [ 'Mecánica', 'Física Cuántica', 'Electromagnetismo', 'Termodinámica' ]
  },
  {
    name: 'Química',
    tutors: 8,
    sessions: 480,
    sessionPercentage: 40,
    rating: 4.5,
    growth: 10,
    topSubjects: [ 'Química Orgánica', 'Química Inorgánica', 'Bioquímica', 'Química Física' ]
  },
  {
    name: 'Biología',
    tutors: 6,
    sessions: 360,
    sessionPercentage: 30,
    rating: 4.6,
    growth: 12,
    topSubjects: [ 'Anatomía', 'Fisiología', 'Biología Molecular', 'Genética' ]
  },
  {
    name: 'Inglés',
    tutors: 4,
    sessions: 240,
    sessionPercentage: 20,
    rating: 4.7,
    growth: 5,
    topSubjects: [ 'Literatura', 'Escritura Creativa', 'Redacción de Ensayos', 'Gramática' ]
  },
  {
    name: 'Historia',
    tutors: 3,
    sessions: 144,
    sessionPercentage: 12,
    rating: 4.5,
    growth: -2,
    topSubjects: [ 'Historia Mundial', 'Historia Americana', 'Historia Europea', 'Civilizaciones Antiguas' ]
  }
];