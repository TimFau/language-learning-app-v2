import { useState, useEffect, useMemo } from 'react';
import { useQuery, DocumentNode } from '@apollo/client';
import { GET_ALL_SAVED_TERMS_FOR_REVIEW, GET_SAVED_TERMS_FOR_REVIEW_BY_LANGUAGE } from 'queries';
import { Term } from 'types/Term';

interface UseReviewSessionProps {
  userId: string;
}

interface ReviewOptions {
  language: string; // 'all' or a specific language code like 'es'
  cardCount: number;
}

export const useReviewSession = ({ userId }: UseReviewSessionProps) => {
  const [sessionState, setSessionState] = useState<'configuring' | 'active' | 'finished'>('configuring');
  const [options, setOptions] = useState<ReviewOptions>({
    language: 'all',
    cardCount: 25,
  });
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, 'hard' | 'okay' | 'easy'>>({});

  const { query, variables } = useMemo(() => {
    const baseVariables = {
      userId,
      limit: options.cardCount,
    };
    if (options.language === 'all') {
      return {
        query: GET_ALL_SAVED_TERMS_FOR_REVIEW,
        variables: baseVariables,
      };
    }
    return {
      query: GET_SAVED_TERMS_FOR_REVIEW_BY_LANGUAGE,
      variables: { ...baseVariables, language: options.language },
    };
  }, [userId, options]);

  const { data, loading, error, refetch } = useQuery(query, {
    variables,
    skip: sessionState !== 'active',
  });

  const terms: Term[] = data?.saved_terms || [];
  const currentTerm = terms?.[currentCardIndex];

  const startSession = () => {
    setCurrentCardIndex(0);
    setResponses({});
    setSessionState('active');
    refetch();
  };

  const endSession = () => {
    setSessionState('finished');
  };

  const restartSession = () => {
    setSessionState('configuring');
  };

  const recordResponse = (termId: string, rating: 'hard' | 'okay' | 'easy') => {
    setResponses(prev => ({ ...prev, [termId]: rating }));
    if (currentCardIndex < terms.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      endSession();
    }
  };

  const updateOptions = (newOptions: Partial<ReviewOptions>) => {
    setOptions(prev => ({ ...prev, ...newOptions }));
  };

  return {
    sessionState,
    options,
    terms,
    currentTerm,
    currentCardIndex,
    loading,
    error,
    startSession,
    restartSession,
    recordResponse,
    updateOptions,
  };
}; 