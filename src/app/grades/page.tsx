'use client'

import { useState, useEffect, FormEvent } from 'react'
import { gradeService } from '@/lib/services/gradeService'
import { Grade } from '@/types/user'
import { ShieldCheck, Loader2, Plus, Edit2, Trash2, X } from 'lucide-react'
import SuccessMessage from '@/components/ui/SuccessMessage'

export default function GradesPage() {
  const [grades, setGrades] = useState<Grade[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // Form State
  const [showForm, setShowForm] = useState(false)
  const [editingGrade, setEditingGrade] = useState<Grade | null>(null)
  const [formData, setFormData] = useState({ gradeNumber: '', description: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadGrades()
  }, [])

  const loadGrades = async () => {
    try {
      const data = await gradeService.getAll()
      setGrades(data.sort((a, b) => a.gradeNumber - b.gradeNumber))
    } catch (err: any) {
      if (err.response?.status === 403) {
         setError('You do not have permission to view grades.')
      } else {
         setError('Failed to load grades')
      }
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    
    try {
      if (editingGrade) {
        await gradeService.update(editingGrade.id, {
          gradeNumber: parseInt(formData.gradeNumber),
          description: formData.description
        })
        setSuccess('Grade updated successfully')
      } else {
        await gradeService.create({
          gradeNumber: parseInt(formData.gradeNumber),
          description: formData.description
        })
        setSuccess('Grade created successfully')
      }
      
      await loadGrades()
      resetForm()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Operation failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this grade?')) return
    
    try {
      await gradeService.delete(id)
      setSuccess('Grade deleted successfully')
      loadGrades()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete grade')
    }
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingGrade(null)
    setFormData({ gradeNumber: '', description: '' })
  }

  const openEdit = (grade: Grade) => {
    setEditingGrade(grade)
    setFormData({ 
      gradeNumber: grade.gradeNumber.toString(), 
      description: grade.description 
    })
    setShowForm(true)
  }

  if (loading) return (
    <div className="flex justify-center items-center h-96">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center animate-slide-down">
        <div className="flex items-center gap-2">
            <ShieldCheck className="h-8 w-8 text-primary" />
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground">Grades</h1>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true) }}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-md hover:shadow-lg hover:opacity-90 transition-all"
        >
          <Plus className="h-4 w-4" />
          Add Grade
        </button>
      </div>

      {success && <SuccessMessage message={success} onDismiss={() => setSuccess('')} />}

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-xl border border-destructive/30 animate-slide-up">
          {error}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-md border border-border rounded-2xl shadow-xl p-6 animate-scale-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {editingGrade ? 'Edit Grade' : 'New Grade'}
              </h2>
              <button onClick={resetForm} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Grade Number</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="100"
                  value={formData.gradeNumber}
                  onChange={e => setFormData({...formData, gradeNumber: e.target.value})}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <input
                  type="text"
                  required
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-sm font-medium border border-input rounded-md hover:bg-accent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Grade'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm animate-slide-up">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="text-left py-3 px-4 font-medium">Grade Level</th>
                <th className="text-left py-3 px-4 font-medium">Description</th>
                <th className="text-right py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {grades.map((grade) => (
                <tr key={grade.id} className="hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4 font-medium">Grade {grade.gradeNumber}</td>
                  <td className="py-3 px-4 text-muted-foreground">{grade.description}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEdit(grade)}
                        className="p-2 hover:bg-accent rounded-full text-blue-600"
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(grade.id)}
                        className="p-2 hover:bg-accent rounded-full text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </div>
  )
}
