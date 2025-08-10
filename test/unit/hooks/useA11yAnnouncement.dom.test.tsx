import React from 'react';
import { render, cleanup, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { useA11yAnnouncement } from '@/hooks/chart/useA11yAnnouncement';

const announceMock = vi.fn();
vi.mock('@/utils/a11y', () => ({
  useLiveRegion: () => announceMock,
}));

function Harness({
  year,
  leader,
}: {
  year: number;
  leader: { name?: string; pop?: number } | undefined;
}) {
  useA11yAnnouncement(year, leader as any);
  return null;
}

describe('useA11yAnnouncement', () => {
  beforeEach(() => {
    announceMock.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  it('announces on initial mount with provided year and leader', () => {
    render(<Harness year={1990} leader={{ name: 'China', pop: 1000 }} />);
    expect(announceMock).toHaveBeenCalledTimes(1);
    expect(announceMock).toHaveBeenCalledWith(
      'Year changed to 1990. Top: China 1000.',
    );
  });

  it('re-announces when year changes', () => {
    const { rerender } = render(
      <Harness year={1990} leader={{ name: 'China', pop: 1000 }} />,
    );
    announceMock.mockClear();

    rerender(<Harness year={1991} leader={{ name: 'China', pop: 1000 }} />);
    expect(announceMock).toHaveBeenCalledTimes(1);
    expect(announceMock).toHaveBeenCalledWith(
      'Year changed to 1991. Top: China 1000.',
    );
  });

  it('re-announces when leader changes', () => {
    const { rerender } = render(
      <Harness year={1990} leader={{ name: 'China', pop: 1000 }} />,
    );
    announceMock.mockClear();

    rerender(<Harness year={1990} leader={{ name: 'India', pop: 900 }} />);
    expect(announceMock).toHaveBeenCalledTimes(1);
    expect(announceMock).toHaveBeenCalledWith(
      'Year changed to 1990. Top: India 900.',
    );
  });

  it('handles undefined leader gracefully (announces "none 0")', () => {
    render(<Harness year={2000} leader={undefined} />);
    expect(announceMock).toHaveBeenCalledTimes(1);
    expect(announceMock).toHaveBeenCalledWith(
      'Year changed to 2000. Top: none 0.',
    );
  });

  it('does not re-announce when neither year nor leader changed', () => {
    const { rerender } = render(
      <Harness year={1990} leader={{ name: 'China', pop: 1000 }} />,
    );
    announceMock.mockClear();

    rerender(<Harness year={1990} leader={{ name: 'China', pop: 1000 }} />);
    expect(announceMock).not.toHaveBeenCalled();
  });
});
