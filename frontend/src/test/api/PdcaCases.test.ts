import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getPdcaCaseDetails } from '../../api/PdcaCases';

global.fetch = vi.fn();

describe('PdcaCases API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getPdcaCaseDetails', () => {
    it('fetches case details with correct parameters', async () => {
      const mockResponse = {
        case: {
          id: 1,
          alertId: 'alert-123',
          title: 'Test Case',
          description: 'Test Description',
          ownerUserId: 1,
          createdByUserId: 1,
          phase: 'PLAN',
          status: 'OPEN',
          caseType: 'ALERT' as const,
          createDate: '2024-01-01T00:00:00Z',
          updateDate: '2024-01-01T00:00:00Z',
        },
        alert: null,
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await getPdcaCaseDetails('1', 1);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/pdca/cases/1?userId=1')
      );
      expect(result).toEqual(mockResponse);
    });

    it('throws error on 404 response', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Case not found' }),
      });

      await expect(getPdcaCaseDetails('999', 1)).rejects.toThrow('Case not found');
    });

    it('throws error on 403 response', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Access denied' }),
      });

      await expect(getPdcaCaseDetails('1', 999)).rejects.toThrow('Access denied');
    });

    it('throws error on network failure', async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      await expect(getPdcaCaseDetails('1', 1)).rejects.toThrow('Network error');
    });

    it('includes userId in query parameters', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ case: {}, alert: null }),
      });

      await getPdcaCaseDetails('5', 42);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('userId=42')
      );
    });

    it('parses JSON response correctly', async () => {
      const mockResponse = {
        case: {
          id: 2,
          alertId: null,
          title: 'Another Case',
          description: null,
          ownerUserId: 5,
          createdByUserId: 5,
          phase: 'DO',
          status: 'IN_PROGRESS',
          caseType: 'TASK' as const,
          createDate: '2024-01-02T00:00:00Z',
          updateDate: '2024-01-02T12:00:00Z',
        },
        alert: {
          id: 'alert-456',
          status: 'ALERT',
          parameter: 'TEMPERATURE',
          value: 95.5,
          threshold: 80,
          machine: 'Machine2',
          timestamp: '2024-01-02T00:00:00Z',
        },
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await getPdcaCaseDetails('2', 5);

      expect(result.case.id).toBe(2);
      expect(result.case.phase).toBe('DO');
      expect(result.alert).not.toBeNull();
      expect(result.alert?.parameter).toBe('TEMPERATURE');
    });
  });
});
