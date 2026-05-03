import { Topic, Difficulty, QuestionType, Question } from '../types';

export const QUESTIONS: Question[] = [
  {
    id: 'bact-1',
    topic: Topic.BACTERIOLOGY,
    difficulty: Difficulty.EASY,
    type: QuestionType.MCQ,
    prompt: 'Which of the following is a Gram-positive bacterium?',
    options: ['Staphylococcus aureus', 'Escherichia coli', 'Salmonella typhi', 'Vibrio cholerae'],
    correctAnswer: 'Staphylococcus aureus',
    feedback: 'Staphylococcus aureus is a Gram-positive, round-shaped bacterium that is a member of the Bacillota.'
  },
  {
    id: 'vir-1',
    topic: Topic.VIROLOGY,
    difficulty: Difficulty.MEDIUM,
    type: QuestionType.THREE_D,
    modelId: 'adenovirus',
    prompt: 'Rotate the model. What is the characteristic shape of this virus capsid?',
    options: ['Icosahedral', 'Helical', 'Complex', 'Prolate'],
    correctAnswer: 'Icosahedral',
    feedback: 'Adenoviruses have a characteristic non-enveloped icosahedral nucleocapsid.'
  },
  {
    id: 'myc-1',
    topic: Topic.MYCOLOGY,
    difficulty: Difficulty.EASY,
    type: QuestionType.TRUE_FALSE,
    prompt: 'Candida albicans is a dimorphic fungus.',
    options: ['True', 'False'],
    correctAnswer: 'True',
    feedback: 'Candida albicans is dimorphic, existing as both yeast and pseudohyphae/hyphae.'
  },
  {
    id: 'bact-2',
    topic: Topic.BACTERIOLOGY,
    difficulty: Difficulty.MEDIUM,
    type: QuestionType.FILL_IN_BLANK,
    prompt: 'The causative agent of Tuberculosis is Mycobacterium ________.',
    correctAnswer: 'tuberculosis',
    feedback: 'Mycobacterium tuberculosis is the species responsible for most cases of tuberculosis.'
  },
  {
    id: 'bact-3',
    topic: Topic.BACTERIOLOGY,
    difficulty: Difficulty.HARD,
    type: QuestionType.MATCHING,
    prompt: 'Match the toxin with its mechanism of action:',
    matchingPairs: [
      { left: 'Diphtheria toxin', right: 'Inhibition of EF-2' },
      { left: 'Cholera toxin', right: 'Permanent activation of Gs' },
      { left: 'Botulinum toxin', right: 'Inhibition of ACh release' },
      { left: 'Tetanus toxin', right: 'Inhibition of GABA/Glycine' }
    ],
    correctAnswer: null, // Logic handled in component
    feedback: 'These are classic bacterial exotoxins with distinct molecular mechanisms.'
  },
  {
    id: 'bact-4',
    topic: Topic.BACTERIOLOGY,
    difficulty: Difficulty.EASY,
    type: QuestionType.MCQ,
    prompt: 'Which of the following is the primary stain used in the Gram stain procedure?',
    options: ['Crystal Violet', 'Safranin', 'Iodine', 'Alcohol'],
    correctAnswer: 'Crystal Violet',
    feedback: 'Crystal violet is the primary stain that binds to the peptidoglycan layer of Gram-positive bacteria.'
  },
  {
    id: 'vir-2',
    topic: Topic.VIROLOGY,
    difficulty: Difficulty.HARD,
    type: QuestionType.MCQ,
    prompt: 'Which viral family uses reverse transcriptase in its replication cycle but is NOT a retrovirus?',
    options: ['Hepadnaviridae', 'Herpesviridae', 'Poxviridae', 'Orthomyxoviridae'],
    correctAnswer: 'Hepadnaviridae',
    feedback: 'Hepadnaviridae (like Hepatitis B) are pararetroviruses that use reverse transcriptase to replicate their DNA genome via an RNA intermediate.'
  },
  {
    id: 'myc-2',
    topic: Topic.MYCOLOGY,
    difficulty: Difficulty.MEDIUM,
    type: QuestionType.MCQ,
    prompt: 'Which fungus is the most common cause of "fungal ball" in a pre-existing lung cavity?',
    options: ['Aspergillus fumigatus', 'Histoplasma capsulatum', 'Blastomyces dermatitidis', 'Cryptococcus neoformans'],
    correctAnswer: 'Aspergillus fumigatus',
    feedback: 'Aspergillus fumigatus is the most frequent cause of aspergilloma (fungal ball) in cavitary lung lesions.'
  },
  {
    id: 'par-1',
    topic: Topic.PARASITOLOGY,
    difficulty: Difficulty.EASY,
    type: QuestionType.MCQ,
    prompt: 'Which parasite is responsible for causing Malaria?',
    options: ['Plasmodium falciparum', 'Entamoeba histolytica', 'Giardia lamblia', 'Trypanosoma brucei'],
    correctAnswer: 'Plasmodium falciparum',
    feedback: 'Plasmodium falciparum is the most deadly of the five species of Plasmodium that cause malaria in humans.'
  },
  {
    id: 'bact-5',
    topic: Topic.BACTERIOLOGY,
    difficulty: Difficulty.MEDIUM,
    type: QuestionType.THREE_D,
    modelId: 'bacillus',
    prompt: 'Observe this model of a rod-shaped bacterium. This morphology is known as:',
    options: ['Bacillus', 'Coccus', 'Spirillum', 'Vibrio'],
    correctAnswer: 'Bacillus',
    feedback: 'Rod-shaped bacteria are referred to as bacilli.'
  }
];
