'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Star } from 'lucide-react'
import { useUser } from '@/hooks/useUser'
import { addReview } from '@/lib/review-service'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

const formSchema = z.object({
  service: z.enum(['grooming', 'petshop'], {
    required_error: 'Por favor, selecciona un servicio.',
  }),
  petName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres.'),
  rating: z.number().min(1, 'La calificación es obligatoria.').max(5),
  feedbackText: z
    .string()
    .min(10, 'La reseña debe tener al menos 10 caracteres.')
    .max(500, 'La reseña no puede superar los 500 caracteres.'),
})

export function AddReviewForm() {
  const { user } = useUser()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      petName: '',
      rating: 0,
      feedbackText: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast({
        title: 'Error',
        description: 'Debes iniciar sesión para dejar una reseña.',
        variant: 'destructive',
      })
      return
    }
    setIsLoading(true)

    const reviewData = {
      clientName: user.firstName || 'Anónimo',
      petName: values.petName,
      imageUrl: user.photoURL || '/placeholder-user.jpg',
      rating: values.rating,
      feedbackText: values.feedbackText,
    }

    const result = await addReview(reviewData, values.service)
    setIsLoading(false)

    if (result.success) {
      toast({
        title: '¡Gracias por tu reseña!',
        description: 'Tu opinión ha sido enviada correctamente.',
      })
      form.reset()
      form.setValue('rating', 0)
    } else {
      toast({
        title: 'Error al enviar la reseña',
        description: 'Hubo un problema al guardar tu opinión. Por favor, inténtalo de nuevo.',
        variant: 'destructive',
      })
    }
  }

  // Clases base para la tarjeta
  const cardClasses = "my-12 max-w-3xl mx-auto transition-all duration-300 shadow-xl"
  // Clases para el modo claro
  const lightCardClasses = "bg-white border-slate-200"
  // Clases para el modo oscuro
  const darkCardClasses = "dark:bg-gradient-to-br dark:from-purple-700 dark:to-blue-800 dark:text-white dark:border-purple-900 dark:shadow-2xl dark:shadow-purple-500/20"

  if (!user) {
    return (
      <Card className={`${cardClasses} ${lightCardClasses} ${darkCardClasses}`}>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold dark:text-white">Deja tu opinión</CardTitle>
          <CardDescription className="dark:text-purple-200 mt-2">
            <a href="/login" className="underline text-primary dark:text-orange-400 font-semibold hover:text-purple-700 dark:hover:text-white transition-colors">Inicia sesión</a> para contarnos tu experiencia y ayudar a otros.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className={`${cardClasses} ${lightCardClasses} ${darkCardClasses}`}>
      <CardHeader>
        <CardTitle className="text-3xl font-bold dark:text-white">Cuéntanos tu experiencia</CardTitle>
        <CardDescription className="text-slate-500 dark:text-purple-200">
          Tu opinión es muy importante para nosotros y para otros dueños de mascotas.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="service"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 dark:text-purple-200">¿Sobre qué servicio quieres opinar?</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-slate-100 dark:bg-white/10 border-slate-300 dark:border-purple-400 placeholder:text-slate-500 dark:placeholder:text-slate-300">
                        <SelectValue placeholder="Selecciona un servicio..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white dark:bg-slate-800 text-black dark:text-white border-slate-200 dark:border-slate-700">
                      <SelectItem value="petshop">Petshop - Compra de productos</SelectItem>
                      <SelectItem value="grooming">Grooming - Peluquería</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="petName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 dark:text-purple-200">Nombre de tu mascota</FormLabel>
                  <FormControl>
                    <Input className="bg-slate-100 dark:bg-white/10 border-slate-300 dark:border-purple-400 placeholder:text-slate-500 dark:placeholder:text-slate-300" placeholder="Ej: Max, Luna..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 dark:text-purple-200">Calificación</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-8 w-8 cursor-pointer transition-all duration-200 ${
                            star <= field.value
                              ? 'text-amber-400 fill-amber-400 scale-110'
                              : 'text-slate-300 dark:text-purple-300 hover:text-amber-300'
                          }`}
                          onClick={() => field.onChange(star)}
                        />
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="feedbackText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 dark:text-purple-200">Tu reseña</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe tu experiencia..."
                      className="resize-none bg-slate-100 dark:bg-white/10 border-slate-300 dark:border-purple-400 placeholder:text-slate-500 dark:placeholder:text-slate-300"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full bg-purple-600 hover:bg-purple-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white font-bold text-lg py-6 transition-transform hover:scale-105">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Enviando...
                </>
              ) : (
                'Enviar reseña'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
} 