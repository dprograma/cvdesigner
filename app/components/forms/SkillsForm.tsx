'use client';

import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { PlusCircle, Trash2 } from 'lucide-react';

const skillCategorySchema = z.object({
  id: z.string().optional(), // Added id
  name: z.string().min(1, 'Category name is required'),
  skills: z.string().min(1, 'At least one skill is required'),
});

const skillsSchema = z.object({
  categories: z.array(skillCategorySchema),
});

type SkillsFormValues = z.infer<typeof skillsSchema>;
type SkillCategory = z.infer<typeof skillCategorySchema>;

interface SkillsFormProps {
  initialData?: SkillCategory[];
  onSave: (data: SkillCategory[]) => void;
}

export default function SkillsForm({ initialData = [], onSave }: SkillsFormProps) {
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SkillsFormValues>({
    resolver: zodResolver(skillsSchema),
    defaultValues: {
      categories: initialData.length > 0 ? initialData : [
        {
          name: 'Technical Skills',
          skills: '',
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'categories',
  });

  const onSubmit = async (data: SkillsFormValues) => {
    setIsSaving(true);
    try {
      onSave(data.categories);
    } catch (error) {
      console.error('Error saving skills info:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Skills</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              append({
                name: '',
                skills: '',
              });
            }}
            className="flex items-center space-x-2"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Add Skill Category</span>
          </Button>
        </div>

        <div className="space-y-6">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="p-4 border rounded-lg bg-gray-50"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="space-y-2 flex-1 mr-4">
                  <Label htmlFor={`categories.${index}.name`}>Category Name *</Label>
                  <Input
                    id={`categories.${index}.name`}
                    {...register(`categories.${index}.name`)}
                    placeholder="Technical Skills"
                  />
                  {errors.categories?.[index]?.name && (
                    <p className="text-sm text-red-500">
                      {errors.categories[index]?.name?.message}
                    </p>
                  )}
                </div>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                    className="text-red-500 hover:text-red-700 mt-8"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`categories.${index}.skills`}>Skills *</Label>
                <Input
                  id={`categories.${index}.skills`}
                  {...register(`categories.${index}.skills`)}
                  placeholder="JavaScript, React, Node.js, TypeScript, HTML, CSS"
                />
                <p className="text-xs text-gray-500">
                  Separate skills with commas
                </p>
                {errors.categories?.[index]?.skills && (
                  <p className="text-sm text-red-500">
                    {errors.categories[index]?.skills?.message}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <h3 className="font-medium mb-2">Tips for Skills Section</h3>
          <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
            <li>Group similar skills into categories (e.g., Programming Languages, Tools, Soft Skills)</li>
            <li>List the most relevant and impressive skills first</li>
            <li>Include both technical and soft skills</li>
            <li>Be honest about your proficiency level</li>
            <li>Tailor your skills to match the job description</li>
          </ul>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Skills'}
        </Button>
      </div>
    </form>
  );
}
