'use client';

import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Label } from '@/app/components/ui/label';
import { PlusCircle, Trash2 } from 'lucide-react';

const educationItemSchema = z.object({
  id: z.string().optional(), // Added id
  institution: z.string().min(1, 'Institution name is required'),
  degree: z.string().min(1, 'Degree is required'),
  fieldOfStudy: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
  gpa: z.string().optional(),
});

const educationSchema = z.object({
  items: z.array(educationItemSchema),
});

type EducationFormValues = z.infer<typeof educationSchema>;
type EducationItem = z.infer<typeof educationItemSchema>;

interface EducationFormProps {
  initialData?: EducationItem[];
  onSave: (data: EducationItem[]) => void;
}

export default function EducationForm({ initialData = [], onSave }: EducationFormProps) {
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EducationFormValues>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      items: initialData.length > 0 ? initialData : [
        {
          institution: '',
          degree: '',
          fieldOfStudy: '',
          startDate: '',
          endDate: '',
          location: '',
          description: '',
          gpa: '',
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const onSubmit = async (data: EducationFormValues) => {
    setIsSaving(true);
    try {
      onSave(data.items);
    } catch (error) {
      console.error('Error saving education info:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Education</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              append({
                institution: '',
                degree: '',
                fieldOfStudy: '',
                startDate: '',
                endDate: '',
                location: '',
                description: '',
                gpa: '',
              });
            }}
            className="flex items-center space-x-2"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Add Education</span>
          </Button>
        </div>

        {fields.map((field, index) => (
          <div
            key={field.id}
            className="p-4 border rounded-lg mb-6 bg-gray-50"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Education #{index + 1}</h3>
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor={`items.${index}.institution`}>Institution *</Label>
                <Input
                  id={`items.${index}.institution`}
                  {...register(`items.${index}.institution`)}
                  placeholder="Harvard University"
                />
                {errors.items?.[index]?.institution && (
                  <p className="text-sm text-red-500">
                    {errors.items[index]?.institution?.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`items.${index}.degree`}>Degree *</Label>
                <Input
                  id={`items.${index}.degree`}
                  {...register(`items.${index}.degree`)}
                  placeholder="Bachelor of Science"
                />
                {errors.items?.[index]?.degree && (
                  <p className="text-sm text-red-500">
                    {errors.items[index]?.degree?.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`items.${index}.fieldOfStudy`}>Field of Study</Label>
                <Input
                  id={`items.${index}.fieldOfStudy`}
                  {...register(`items.${index}.fieldOfStudy`)}
                  placeholder="Computer Science"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`items.${index}.location`}>Location</Label>
                <Input
                  id={`items.${index}.location`}
                  {...register(`items.${index}.location`)}
                  placeholder="Cambridge, MA"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`items.${index}.startDate`}>Start Date</Label>
                <Input
                  id={`items.${index}.startDate`}
                  {...register(`items.${index}.startDate`)}
                  placeholder="September 2018"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`items.${index}.endDate`}>End Date</Label>
                <Input
                  id={`items.${index}.endDate`}
                  {...register(`items.${index}.endDate`)}
                  placeholder="May 2022 (or 'Present')"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`items.${index}.gpa`}>GPA</Label>
                <Input
                  id={`items.${index}.gpa`}
                  {...register(`items.${index}.gpa`)}
                  placeholder="3.8/4.0"
                />
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <Label htmlFor={`items.${index}.description`}>Description</Label>
              <Textarea
                id={`items.${index}.description`}
                {...register(`items.${index}.description`)}
                placeholder="Relevant coursework, honors, activities, etc."
                rows={3}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Education'}
        </Button>
      </div>
    </form>
  );
}
