// ============================================================
// src/test/tour.test.tsx
// Tier 4: Guided Tour Interactive Walkthrough & Accessibility Tests
// Verifies modal dialog landmarks, step navigation, tab highlights, and skip controls
// Per TESTING_STANDARDS.md & ACCESSIBILITY.md
// ============================================================

import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '@/App';
import { AppContextProvider } from '@/context/AppContext';
import { GuidedTourModal } from '@/components/Tour/GuidedTourModal';
import { Header } from '@/components/Navigation/Header';

describe('Guided Tour Component & Keyboard Accessibility', () => {
  it('does not render modal dialog when tour is closed', () => {
    render(
      <AppContextProvider>
        <GuidedTourModal />
      </AppContextProvider>
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens guided tour modal, highlights current tab, and shows active section', () => {
    render(
      <AppContextProvider>
        <Header />
        <GuidedTourModal />
      </AppContextProvider>
    );

    const tourBtn = screen.getByRole('button', { name: /Open guided walkthrough tour/i });
    fireEvent.click(tourBtn);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(screen.getByText(/Welcome to SaansIQ/i)).toBeInTheDocument();
    expect(screen.getByText(/Step 1 of 6/i)).toBeInTheDocument();
    expect(screen.getByText(/Currently on Section:/i)).toBeInTheDocument();

    // Verify highlighted tab has Tour Focus badge
    expect(screen.getByText(/Tour Focus/i)).toBeInTheDocument();
  });

  it('navigates through steps using Next and Previous buttons and updates highlighted tab', () => {
    render(<App />);

    // Open tour
    const tourBtn = screen.getByRole('button', { name: /Open guided walkthrough tour/i });
    fireEvent.click(tourBtn);

    expect(screen.getByText(/Step 1 of 6/i)).toBeInTheDocument();

    // Click Next Step
    const nextBtn = screen.getByRole('button', { name: /Next Step/i });
    fireEvent.click(nextBtn);

    expect(screen.getByText(/Step 2 of 6/i)).toBeInTheDocument();
    expect(screen.getByText(/Hyperlocal Telemetry & Smog Heatmap/i)).toBeInTheDocument();

    // Click Next Step again to go to Step 3 (Routine)
    fireEvent.click(screen.getByRole('button', { name: /Next Step/i }));
    expect(screen.getByText(/Step 3 of 6/i)).toBeInTheDocument();
    expect(screen.getByText(/GenAI Daily Routine Optimizer/i)).toBeInTheDocument();

    // Click Previous
    const prevBtn = screen.getByRole('button', { name: /Previous/i });
    fireEvent.click(prevBtn);
    expect(screen.getByText(/Step 2 of 6/i)).toBeInTheDocument();
  });

  it('closes guided tour when clicking the Skip Tour button at any point', () => {
    render(
      <AppContextProvider>
        <Header />
        <GuidedTourModal />
      </AppContextProvider>
    );

    const tourBtn = screen.getByRole('button', { name: /Open guided walkthrough tour/i });
    fireEvent.click(tourBtn);

    const skipBtns = screen.getAllByRole('button', { name: /Skip/i });
    expect(skipBtns.length).toBeGreaterThan(0);
    fireEvent.click(skipBtns[0]);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes guided tour on Escape key press (WCAG Keyboard Dismissal)', () => {
    render(
      <AppContextProvider>
        <Header />
        <GuidedTourModal />
      </AppContextProvider>
    );

    const tourBtn = screen.getByRole('button', { name: /Open guided walkthrough tour/i });
    fireEvent.click(tourBtn);

    expect(screen.getByRole('dialog')).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
