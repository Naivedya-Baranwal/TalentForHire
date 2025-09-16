import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, FileText, Plus, Eye, X, Edit2, Trash2, Save } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import {
  fetchAssessmentByJobId,
  createAssessment,
  updateAssessment,
  deleteAssessment
} from '@/features/assessments/assessmentsThunks';
import { 
  selectCurrentAssessment,
  selectAssessmentsLoading,
  selectAssessmentsSaving,
  addSection,
  addQuestion,
  removeSection,
  removeQuestion,
  clearAssessment
} from '@/features/assessments/assessmentsSlice';

const AssessmentBuilderPage = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const dispatch = useDispatch();
  const { toast } = useToast();
  
  const currentAssessment = useSelector(selectCurrentAssessment);
  const loading = useSelector(selectAssessmentsLoading);
  const saving = useSelector(selectAssessmentsSaving);
  
  const [isAddingSectionModalOpen, setIsAddingSectionModalOpen] = useState(false);
  const [isAddingQuestionModalOpen, setIsAddingQuestionModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [currentSectionId, setCurrentSectionId] = useState<string | null>(null);
  const [initialFetchComplete, setInitialFetchComplete] = useState(false);
  const [assessmentExists, setAssessmentExists] = useState<boolean | null>(null);
  
  const [sectionForm, setSectionForm] = useState({ title: '', description: '' });
  const [questionForm, setQuestionForm] = useState({
    type: 'text-based',
    subtype: 'short_text',
    title: '',
    correctAnswer: '',
    options: ['', '', '', ''],
    correctOptions: [] as number[]
  });

  useEffect(() => {
    const fetchExistingAssessment = async () => {
      if (jobId && !initialFetchComplete) {
        try {
          const result = await dispatch(fetchAssessmentByJobId(jobId) as any);
          if (result.payload && result.payload.success && result.payload.data) {
            setAssessmentExists(true);
          } else {
            setAssessmentExists(false);
            dispatch(clearAssessment());
          }
        } catch (error) {
          setAssessmentExists(false);
          dispatch(clearAssessment());
        } finally {
          setInitialFetchComplete(true);
        }
      }
    };
    fetchExistingAssessment();
  }, [dispatch, jobId, initialFetchComplete]);

  const hasQuestions = currentAssessment?.sections?.some((section: any) => section.questions.length > 0);

  // Token-friendly type badge classes
  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case 'short_text': return 'bg-info/15 text-info border-info/30';
      case 'long_text': return 'bg-primary/15 text-primary border-primary/30';
      case 'single_choice': return 'bg-warning/15 text-warning border-warning/30';
      case 'multiple_choice': return 'bg-success/15 text-success border-success/30';
      default: return 'bg-muted/60 text-muted-foreground border-border';
    }
  };

  // Section accent stripe (left border)
  const sectionStripeStyle: React.CSSProperties = { borderLeftColor: 'hsl(var(--primary))' };

  const handleAddSection = async () => {
    if (!sectionForm.title.trim()) {
      toast({ title: "Error", description: "Section name is required.", variant: "destructive" });
      return;
    }
    try {
      if (!currentAssessment && assessmentExists === false && jobId) {
        await dispatch(createAssessment({
          jobId: jobId,
          assessmentData: {
            job_id: jobId,
            title: `Assessment for Job ${jobId}`,
            description: `Assessment for this job position`,
            sections: []
          }
        }) as any).unwrap();
        setAssessmentExists(true);
      }
      dispatch(addSection({ section: { title: sectionForm.title, description: sectionForm.description } }));
      setSectionForm({ title: '', description: '' });
      setIsAddingSectionModalOpen(false);
      toast({ title: "Section added", description: "New section has been created successfully." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to add section. Please try again.", variant: "destructive" });
    }
  };

  const handleSubmitAssessment = () => {
    if (currentAssessment && jobId) {
      dispatch(updateAssessment({ assessmentId: jobId, assessmentData: currentAssessment }) as any);
      toast({ title: "Assessment saved", description: "Your assessment has been saved successfully." });
    }
  };

  const handleDeleteAssessment = async () => {
    if (currentAssessment && jobId) {
      try {
        await dispatch(deleteAssessment(jobId) as any).unwrap();
        setAssessmentExists(false);
        setInitialFetchComplete(false);
        toast({ title: "Assessment deleted", description: "Assessment has been deleted successfully." });
      } catch (error: any) {
        toast({ title: "Delete failed", description: error?.message || "Failed to delete assessment. Please try again.", variant: "destructive" });
      }
    }
  };

  const handleAddQuestion = () => {
    if (!questionForm.title.trim()) {
      toast({ title: "Error", description: "Question text is required.", variant: "destructive" });
      return;
    }
    if (questionForm.type === 'text-based' && !questionForm.correctAnswer.trim()) {
      toast({ title: "Error", description: "Correct answer is required for text-based questions.", variant: "destructive" });
      return;
    }
    if (questionForm.type === 'option-based') {
      const filledOptions = questionForm.options.filter(opt => opt.trim());
      if (filledOptions.length < 2) {
        toast({ title: "Error", description: "At least 2 options are required.", variant: "destructive" });
        return;
      }
      if (questionForm.correctOptions.length === 0) {
        toast({ title: "Error", description: "At least one correct option must be selected.", variant: "destructive" });
        return;
      }
    }

    const questionData: any = {
      type: questionForm.subtype,
      title: questionForm.title,
      required: true
    };
    if (questionForm.type === 'text-based') {
      questionData.correctAnswer = questionForm.correctAnswer;
    } else {
      questionData.options = questionForm.options.filter(opt => opt.trim());
      questionData.correctOptions = questionForm.correctOptions;
    }

    dispatch(addQuestion({ sectionId: currentSectionId!, question: questionData }));

    setQuestionForm({
      type: 'text-based',
      subtype: 'short_text',
      title: '',
      correctAnswer: '',
      options: ['', '', '', ''],
      correctOptions: []
    });
    setIsAddingQuestionModalOpen(false);
    setCurrentSectionId(null);
    toast({ title: "Question added", description: "New question has been added to the section." });
  };

  const handleRemoveSection = (sectionId: string) => {
    dispatch(removeSection({ sectionId }));
    toast({ title: "Section removed", description: "Section has been deleted successfully." });
  };

  const handleRemoveQuestion = (sectionId: string, questionId: string) => {
    dispatch(removeQuestion({ sectionId, questionId }));
    toast({ title: "Question removed", description: "Question has been deleted successfully." });
  };

  if (loading && !initialFetchComplete) {
    return (
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="text-center py-16">
          <div className="animate-spin h-6 w-6 md:h-8 md:w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-sm md:text-base text-muted-foreground">Loading assessment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 mb-6 md:mb-8">
          <Button variant="ghost" size="sm" asChild className="w-fit">
            <Link to={`/jobs/${jobId}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Back to Job</span>
              <span className="md:hidden">Back</span>
            </Link>
          </Button>

          <div className="hidden md:block h-6 w-px bg-border" />

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gradient-primary flex items-center justify-center md:justify-start gap-2 md:gap-3">
              <FileText className="h-7 w-7 md:h-8 md:w-8 text-primary" />
              Assessment Builder
            </h1>
            <p className="text-sm md:text-base text-muted-foreground mt-2">
              Create and manage assessments with sections and questions
            </p>
          </div>
        </div>

        {/* Top actions */}
        {currentAssessment && currentAssessment?.sections?.length > 0 && (
          <div className="flex flex-col md:flex-row gap-2 md:gap-2 mb-6 md:mb-8 md:justify-end">
            <Button 
              onClick={handleSubmitAssessment}
              disabled={saving}
              className="bg-gradient-primary hover:opacity-90 w-full md:w-auto order-1"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Submit Assessment'}
            </Button>
            
            <Button
              variant="outline"
              onClick={handleDeleteAssessment}
              className="text-destructive hover:text-destructive w-full md:w-auto order-2"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Assessment
            </Button>
          </div>
        )}

        {assessmentExists === true && currentAssessment ? (
          <>
            {/* Secondary actions */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 md:mb-8">
              <Button 
                onClick={() => setIsAddingSectionModalOpen(true)}
                className="bg-gradient-primary hover:opacity-90 w-full sm:w-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Section
              </Button>
              
              {hasQuestions && (
                <Button 
                  variant="outline"
                  onClick={() => setIsPreviewModalOpen(true)}
                  className="h-10 w-10 p-0 grid place-items-center rounded-full sm:h-10 sm:w-auto sm:px-4 sm:rounded-xl"
                  aria-label="Open live preview"
                >
                  <Eye className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Live Preview</span>
                </Button>
              )}
            </div>

            {/* Sections */}
            {currentAssessment?.sections?.length > 0 ? (
              <div className="space-y-4 md:space-y-6">
                {currentAssessment.sections.map((section: any) => (
                  <Card
                    key={section.id}
                    className="bg-card/90 border border-border rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden relative border-l-4"
                    style={sectionStripeStyle}
                  >
                    <CardHeader className="pb-2 md:pb-3 p-4 md:p-6">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg md:text-xl text-foreground">{section.title}</CardTitle>
                          {section.description && (
                            <CardDescription className="text-sm md:text-base text-muted-foreground mt-1">{section.description}</CardDescription>
                          )}
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button
                            size="sm"
                            onClick={() => {
                              setCurrentSectionId(section.id);
                              setIsAddingQuestionModalOpen(true);
                            }}
                            className="w-full sm:w-auto bg-gradient-primary"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Question
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRemoveSection(section.id)}
                            className="w-full sm:w-auto"
                            aria-label="Remove section"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="p-4 md:p-6 pt-0">
                      {section.questions.length > 0 ? (
                        <div className="space-y-3 md:space-y-4 max-h-96 overflow-y-auto pr-1">
                          {section.questions.map((question: any, index: number) => (
                            <div key={question.id} className="border border-border rounded-lg p-3 md:p-4 bg-muted/30">
                              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-2">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-medium text-foreground">Q{index + 1}.</span>
                                    <Badge variant="outline" className={`text-xs border ${getTypeBadgeClass(question.type)}`}>
                                      {question.type === 'short_text' ? 'Short Text' : 
                                       question.type === 'long_text' ? 'Long Text' :
                                       question.type === 'single_choice' ? 'Single Choice' :
                                       question.type === 'multiple_choice' ? 'Multiple Choice' : question.type}
                                    </Badge>
                                  </div>
                                  <p className="text-sm md:text-base font-medium text-foreground">{question.title}</p>

                                  {question.options && (
                                    <div className="mt-2 space-y-1">
                                      {question.options.map((option: any, optIndex: number) => (
                                        <div key={optIndex} className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                                          <span className="font-mono">{String.fromCharCode(65 + optIndex)}.</span>
                                          <span>{option.text}</span>
                                          {question.correctOptions?.includes(optIndex) && (
                                            <Badge variant="default" className="text-[10px] h-5 px-2">Correct</Badge>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  {question.correctAnswer && (
                                    <div className="mt-2 text-xs md:text-sm">
                                      <span className="text-muted-foreground">Correct Answer: </span>
                                      <Badge variant="default" className="text-[10px] h-5 px-2">{question.correctAnswer}</Badge>
                                    </div>
                                  )}
                                </div>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleRemoveQuestion(section.id, question.id)}
                                  className="w-fit self-start md:self-center"
                                  aria-label="Remove question"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 md:py-8 text-muted-foreground">
                          <FileText className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm md:text-base">No questions added yet. Click "Add Question" to get started.</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 md:py-16">
                <FileText className="h-12 w-12 md:h-16 md:w-16 text-muted-foreground mx-auto mb-4 md:mb-6 opacity-50" />
                <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-foreground">Start Building Your Assessment</h2>
                <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6 max-w-md mx-auto px-4">
                  Create sections to organize your questions and build a comprehensive assessment for candidates.
                </p>
                <Button 
                  onClick={() => setIsAddingSectionModalOpen(true)}
                  className="bg-gradient-primary hover:opacity-90 w-full sm:w-auto"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Section
                </Button>
              </div>
            )}
          </>
        ) : assessmentExists === false ? (
          <div className="text-center py-12 md:py-16">
            <FileText className="h-12 w-12 md:h-16 md:w-16 text-muted-foreground mx-auto mb-4 md:mb-6 opacity-50" />
            <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-foreground">Start Building Your Assessment</h2>
            <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6 max-w-md mx-auto px-4">
              No assessment exists for this job yet. Create sections to organize your questions and build a comprehensive assessment for candidates.
            </p>
            <Button 
              onClick={() => setIsAddingSectionModalOpen(true)}
              className="bg-gradient-primary hover:opacity-90 w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Section
            </Button>
          </div>
        ) : (
          <div className="text-center py-12 md:py-16">
            <FileText className="h-12 w-12 md:h-16 md:w-16 text-muted-foreground mx-auto mb-4 md:mb-6 opacity-50" />
            <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-foreground">Loading Assessment...</h2>
            <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6 max-w-md mx-auto px-4">
              Please wait while we prepare your assessment.
            </p>
          </div>
        )}

        {/* Add Section Modal */}
        <Dialog open={isAddingSectionModalOpen} onOpenChange={setIsAddingSectionModalOpen}>
          <DialogContent className="w-[95%] max-w-md max-h-[90vh] overflow-y-auto bg-card text-foreground">
            <DialogHeader>
              <DialogTitle className="text-base md:text-lg">Add New Section</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Create a new section to organize your assessment questions.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh] overflow-y-auto">
              <div className="space-y-4 pr-4 pl-1">
                <div>
                  <Label htmlFor="section-title" className="text-sm">Section Name *</Label>
                  <Input
                    id="section-title"
                    value={sectionForm.title}
                    onChange={(e) => setSectionForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Technical Skills"
                    className="text-sm border-2 border-border bg-background"
                  />
                </div>
                <div>
                  <Label htmlFor="section-description" className="text-sm">Description (Optional)</Label>
                  <Textarea
                    id="section-description"
                    value={sectionForm.description}
                    onChange={(e) => setSectionForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of this section..."
                    rows={3}
                    className="text-sm pl-1 mb-1 border-2 border-border bg-background"
                  />
                </div>
              </div>
            </ScrollArea>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setIsAddingSectionModalOpen(false)} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button onClick={handleAddSection} className="w-full sm:w-auto bg-gradient-primary">
                Create Section
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Question Modal */}
        <Dialog open={isAddingQuestionModalOpen} onOpenChange={setIsAddingQuestionModalOpen}>
          <DialogContent className="w-[95%] max-w-2xl max-h-[90vh] overflow-y-auto bg-card text-foreground">
            <DialogHeader>
              <DialogTitle className="text-base md:text-lg">Add New Question</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Create a new question for the selected section.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[70vh] overflow-y-auto">
              <div className="space-y-4 pr-4">
                <div>
                  <Label className="text-sm">Question Type *</Label>
                  <Select 
                    value={questionForm.type} 
                    onValueChange={(value) => {
                      setQuestionForm(prev => ({ 
                        ...prev, 
                        type: value,
                        subtype: value === 'text-based' ? 'short_text' : 'single_choice'
                      }));
                    }}
                  >
                    <SelectTrigger className="text-sm border-2 border-border bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text-based">Text-based</SelectItem>
                      <SelectItem value="option-based">Option-based</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {questionForm.type === 'option-based' && (
                  <div>
                    <Label className="text-sm">Choice Type</Label>
                    <Select 
                      value={questionForm.subtype} 
                      onValueChange={(value) => setQuestionForm(prev => ({ ...prev, subtype: value }))}
                    >
                      <SelectTrigger className="text-sm ml-1 border-2 border-border bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single_choice">Single Choice</SelectItem>
                        <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <Label htmlFor="question-title" className="text-sm">Question Text *</Label>
                  <Textarea
                    id="question-title"
                    value={questionForm.title}
                    onChange={(e) => setQuestionForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter your question here..."
                    rows={3}
                    className="text-sm ml-1 border-2 border-border bg-background"
                  />
                </div>

                {questionForm.type === 'text-based' && (
                  <div>
                    <Label htmlFor="correct-answer" className="text-sm">Correct Answer *</Label>
                    <Input
                      id="correct-answer"
                      value={questionForm.correctAnswer}
                      onChange={(e) => setQuestionForm(prev => ({ ...prev, correctAnswer: e.target.value }))}
                      placeholder="One-word answer"
                      className="text-sm ml-1 mb-1 border-2 border-border bg-background"
                    />
                  </div>
                )}

                {questionForm.type === 'option-based' && (
                  <div className="space-y-4">
                    <Label className="text-sm">Options (A, B, C, D)</Label>
                    {questionForm.options.map((option, index) => (
                      <div key={index} className="flex items-center gap-2 md:gap-3">
                        <span className="font-mono text-xs md:text-sm w-4 md:w-6">{String.fromCharCode(65 + index)}.</span>
                        <Input
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...questionForm.options];
                            newOptions[index] = e.target.value;
                            setQuestionForm(prev => ({ ...prev, options: newOptions }));
                          }}
                          placeholder={`Option ${String.fromCharCode(65 + index)}`}
                          className="text-sm border-2 border-border bg-background"
                        />
                        <div className="flex items-center gap-1">
                          <Checkbox
                            checked={questionForm.correctOptions.includes(index)}
                            onCheckedChange={(checked) => {
                              let newCorrectOptions = [...questionForm.correctOptions];
                              if (checked) {
                                if (questionForm.subtype === 'single_choice') {
                                  newCorrectOptions = [index];
                                } else {
                                  newCorrectOptions.push(index);
                                }
                              } else {
                                newCorrectOptions = newCorrectOptions.filter(i => i !== index);
                              }
                              setQuestionForm(prev => ({ ...prev, correctOptions: newCorrectOptions }));
                            }}
                          />
                          <Label className="text-xs text-muted-foreground hidden md:inline">Correct</Label>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setIsAddingQuestionModalOpen(false)} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button onClick={handleAddQuestion} className="w-full sm:w-auto bg-gradient-primary">
                Add Question
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Live Preview Modal */}
        <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
          <DialogContent className="w-[95%] max-w-4xl max-h-[90vh] overflow-y-auto bg-card text-foreground">
            <DialogHeader>
              <DialogTitle className="text-base md:text-lg">Assessment Preview</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                This is how candidates will see the assessment form.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[70vh] overflow-y-auto">
              <div className="space-y-6 md:space-y-8 pr-4">
                {currentAssessment?.sections?.map((section: any) => (
                  <div key={section.id} className="space-y-3 md:space-y-4">
                    <div className="border-b border-border pb-2">
                      <h3 className="text-base md:text-lg font-semibold text-foreground">{section.title}</h3>
                      {section.description && (
                        <p className="text-muted-foreground text-xs md:text-sm">{section.description}</p>
                      )}
                    </div>
                    
                    {section.questions.map((question: any, qIndex: number) => (
                      <div key={question.id} className="space-y-2 md:space-y-3 p-3 md:p-4 border border-border rounded-lg">
                        <Label className="text-sm md:text-base font-medium text-foreground">
                          {qIndex + 1}. {question.title}
                          {question.required && <span className="text-destructive ml-1">*</span>}
                        </Label>
                        
                        {question.type === 'short_text' && (
                          <Input placeholder="Enter your answer..." disabled className="text-sm bg-background border-2 border-border" />
                        )}
                        
                        {question.type === 'long_text' && (
                          <Textarea placeholder="Enter your detailed answer..." rows={4} disabled className="text-sm bg-background border-2 border-border" />
                        )}
                        
                        {(question.type === 'single_choice' || question.type === 'multiple_choice') && (
                          <div className="space-y-2">
                            {question.options?.map((option: any, optIndex: number) => (
                              <div key={optIndex} className="flex items-center space-x-2">
                                <input 
                                  type={question.type === 'single_choice' ? 'radio' : 'checkbox'}
                                  name={`question-${question.id}`}
                                  disabled
                                  className="opacity-50"
                                  aria-hidden="true"
                                />
                                <Label className="text-xs md:text-sm text-foreground">{option.text}</Label>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </ScrollArea>
            <DialogFooter>
              <Button onClick={() => setIsPreviewModalOpen(false)} className="w-full sm:w-auto bg-gradient-primary">
                Close Preview
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AssessmentBuilderPage;
