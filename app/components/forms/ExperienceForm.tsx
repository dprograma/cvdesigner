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

const experienceItemSchema = z.object({
  id: z.string().optional(), // Added id
  company: z.string().min(1, 'Company name is required'),
  position: z.string().min(1, 'Position is required'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
});

const experienceSchema = z.object({
  items: z.array(experienceItemSchema),
});

type ExperienceFormValues = z.infer<typeof experienceSchema>;
type ExperienceItem = z.infer<typeof experienceItemSchema>;

interface ExperienceFormProps {
  initialData?: ExperienceItem[];
  onSave: (data: ExperienceItem[]) => void;
}

export default function ExperienceForm({ initialData = [], onSave }: ExperienceFormProps) {
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      items: initialData.length > 0 ? initialData : [
        {
          company: '',
          position: '',
          startDate: '',
          endDate: '',
          location: '',
          description: '',
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const onSubmit = async (data: ExperienceFormValues) => {
    setIsSaving(true);
    try {
      onSave(data.items);
    } catch (error) {
      console.error('Error saving experience info:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Work Experience</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              append({
                company: '',
                position: '',
                startDate: '',
                endDate: '',
                location: '',
                description: '',
              });
            }}
            className="flex items-center space-x-2"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Add Experience</span>
          </Button>
        </div>

        {fields.map((field, index) => (
          <div
            key={field.id}
            className="p-4 border rounded-lg mb-6 bg-gray-50"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Experience #{index + 1}</h3>
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
                <Label htmlFor={`items.${index}.company`}>Company *</Label>
                <Input
                  id={`items.${index}.company`}
                  {...register(`items.${index}.company`)}
                  placeholder="Google"
                />
                {errors.items?.[index]?.company && (
                  <p className="text-sm text-red-500">
                    {errors.items[index]?.company?.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`items.${index}.position`}>Position *</Label>
                <Input
                  id={`items.${index}.position`}
                  {...register(`items.${index}.position`)}
                  placeholder="Software Engineer"
                />
                {errors.items?.[index]?.position && (
                  <p className="text-sm text-red-500">
                    {errors.items[index]?.position?.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`items.${index}.location`}>Location</Label>
                <Input
                  id={`items.${index}.location`}
                  {...register(`items.${index}.location`)}
                  placeholder="Mountain View, CA"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`items.${index}.startDate`}>Start Date</Label>
                <Input
                  id={`items.${index}.startDate`}
                  {...register(`items.${index}.startDate`)}
                  placeholder="January 2020"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`items.${index}.endDate`}>End Date</Label>
                <Input
                  id={`items.${index}.endDate`}
                  {...register(`items.${index}.endDate`)}
                  placeholder="Present"
                />
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <Label htmlFor={`items.${index}.description`}>Description</Label>
              <Textarea
                id={`items.${index}.description`}
                {...register(`items.${index}.description`)}
                placeholder="• Developed and maintained key features for the company's main product
• Led a team of 5 engineers to deliver a critical project on time
• Improved system performance by 40% through code optimization"
                rows={5}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Experience'}
        </Button>
      </div>
    </form>
  );
}
