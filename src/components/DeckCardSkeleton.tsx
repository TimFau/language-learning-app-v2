import React from 'react';
import { Skeleton, Card, CardContent, CardActions } from '@mui/material';

const DeckCardSkeleton: React.FC = () => (
  <Card className="deck-card deck-card-skeleton">
    <CardContent>
      <div className="card-content-top">
        <div className="deck-info">
          <Skeleton variant="circular" width={24} height={24} className="deck-skeleton-icon" />
          <Skeleton variant="text" width={60} height={20} className="deck-skeleton-lang" />
        </div>
        {/* Add back if categories become required attribute */}
        {/* <div className="deck-categories">
          <Skeleton variant="rounded" width={50} height={28} className="deck-skeleton-chip" />
        </div> */}
      </div>
      <Skeleton variant="text" width="70%" height={32} className="deck-name deck-skeleton-name" />
    </CardContent>
    <CardActions style={{ justifyContent: 'flex-end' }}>
      <div>
        <Skeleton variant="text" width={80} height={30} className="deck-skeleton-cta" />
      </div>
    </CardActions>
  </Card>
);

export default DeckCardSkeleton; 