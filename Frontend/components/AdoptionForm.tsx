"use client"

import { useState, type FormEvent } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2Icon } from 'lucide-react'

interface AdoptionFormProps {
    onSubmit: (answers: Record<string, string>) => Promise<void>;
    isSubmitting: boolean;
}

const questions = [
    { id: 'experience', label: '¿Tienes experiencia previa con mascotas?', type: 'textarea' },
    { id: 'livingSituation', label: 'Describe tu situación de vivienda (¿Casa o apartamento? ¿Tienes patio?)', type: 'textarea' },
    { id: 'familyMembers', label: '¿Quiénes viven en tu hogar?', type: 'input' },
    { id: 'vetAccess', label: '¿Tienes acceso a un veterinario de confianza?', type: 'input' },
    { id: 'reason', label: '¿Por qué quieres adoptar esta mascota?', type: 'textarea' },
];

export function AdoptionForm({ onSubmit, isSubmitting }: AdoptionFormProps) {
    const [answers, setAnswers] = useState<Record<string, string>>({});

    const handleInputChange = (id: string, value: string) => {
        setAnswers(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit(answers);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {questions.map(({ id, label, type }) => (
                <div key={id} className="space-y-2">
                    <Label htmlFor={id}>{label}</Label>
                    {type === 'textarea' ? (
                        <Textarea
                            id={id}
                            value={answers[id] || ''}
                            onChange={(e) => handleInputChange(id, e.target.value)}
                            required
                            className="min-h-[100px]"
                        />
                    ) : (
                        <Input
                            id={id}
                            value={answers[id] || ''}
                            onChange={(e) => handleInputChange(id, e.target.value)}
                            required
                        />
                    )}
                </div>
            ))}
            <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
                    Enviar Solicitud
                </Button>
            </div>
        </form>
    );
} 