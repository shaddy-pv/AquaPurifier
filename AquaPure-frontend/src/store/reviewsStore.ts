import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified: boolean;
  helpful: number;
  images?: string[];
  approved: boolean;
}

interface ReviewsStore {
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'date' | 'helpful' | 'approved'>) => void;
  getProductReviews: (productId: string) => Review[];
  markHelpful: (reviewId: string) => void;
  approveReview: (reviewId: string) => void;
  getAverageRating: (productId: string) => number;
}

export const useReviewsStore = create<ReviewsStore>()(
  persist(
    (set, get) => ({
      reviews: [
        {
          id: '1',
          productId: '1',
          userId: '1',
          userName: 'Priya Sharma',
          rating: 5,
          title: 'Excellent water purifier!',
          comment: 'The water quality has improved significantly. Installation was smooth and the technician was professional.',
          date: '2024-11-15',
          verified: true,
          helpful: 24,
          approved: true,
        },
        {
          id: '2',
          productId: '1',
          userId: '2',
          userName: 'Rajesh Kumar',
          rating: 4,
          title: 'Good product, worth the price',
          comment: 'Works well, but the filter replacement could be easier. Overall satisfied with the purchase.',
          date: '2024-11-20',
          verified: true,
          helpful: 12,
          approved: true,
        },
      ],

      addReview: (review) => {
        const newReview: Review = {
          ...review,
          id: Date.now().toString(),
          date: new Date().toISOString().split('T')[0],
          helpful: 0,
          approved: false, // Requires admin approval
        };
        set((state) => ({ reviews: [...state.reviews, newReview] }));
      },

      getProductReviews: (productId) => {
        return get().reviews.filter(
          (review) => review.productId === productId && review.approved
        );
      },

      markHelpful: (reviewId) => {
        set((state) => ({
          reviews: state.reviews.map((review) =>
            review.id === reviewId
              ? { ...review, helpful: review.helpful + 1 }
              : review
          ),
        }));
      },

      approveReview: (reviewId) => {
        set((state) => ({
          reviews: state.reviews.map((review) =>
            review.id === reviewId ? { ...review, approved: true } : review
          ),
        }));
      },

      getAverageRating: (productId) => {
        const productReviews = get().getProductReviews(productId);
        if (productReviews.length === 0) return 0;
        const sum = productReviews.reduce((acc, review) => acc + review.rating, 0);
        return sum / productReviews.length;
      },
    }),
    {
      name: 'aquapure-reviews',
    }
  )
);
