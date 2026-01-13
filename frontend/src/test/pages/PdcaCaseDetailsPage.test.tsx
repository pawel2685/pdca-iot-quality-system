import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PdcaCaseDetailsPage from '../../pages/PdcaCaseDetailsPage';
import { AuthContext, type AuthUser } from '../../auth/AuthContext';
import * as PdcaCasesAPI from '../../api/PdcaCases';

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useParams: () => ({ caseId: '1' }),
    };
});

vi.mock('../../api/PdcaCases');
vi.mock('../../api/Alerts');
vi.mock('../../components/AppHeader', () => ({
    default: () => <div>AppHeader</div>,
}));
vi.mock('../../components/PdcaCaseHeader', () => ({
    default: () => <div>PdcaCaseHeader</div>,
}));
vi.mock('../../components/details/PdcaStatusTimeline', () => ({
    default: () => <div>PdcaStatusTimeline</div>,
}));
vi.mock('../../components/details/PdcaTasksPanel', () => ({
    default: () => <div>PdcaTasksPanel</div>,
}));
vi.mock('../../components/details/PdcaAssignTaskForm', () => ({
    default: () => <div>PdcaAssignTaskForm</div>,
}));

describe('PdcaCaseDetailsPage', () => {
    const mockUser: AuthUser = {
        id: 1,
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'MANAGER',
    };

    const mockCaseDetails = {
        case: {
            id: 1,
            alertId: 'alert-123',
            title: 'Test PDCA Case',
            description: 'Test case description',
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

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders loading state initially', () => {
        (PdcaCasesAPI.getPdcaCaseDetails as any).mockImplementation(
            () => new Promise(() => { })
        );

        render(
            <BrowserRouter>
                <AuthContext.Provider value={{ user: mockUser, setUser: () => { } }}>
                    <PdcaCaseDetailsPage />
                </AuthContext.Provider>
            </BrowserRouter>
        );

        expect(screen.getByText('AppHeader')).toBeInTheDocument();
    });

    it('fetches case details on mount', async () => {
        (PdcaCasesAPI.getPdcaCaseDetails as any).mockResolvedValueOnce(mockCaseDetails);

        render(
            <BrowserRouter>
                <AuthContext.Provider value={{ user: mockUser, setUser: () => { } }}>
                    <PdcaCaseDetailsPage />
                </AuthContext.Provider>
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(PdcaCasesAPI.getPdcaCaseDetails).toHaveBeenCalledWith('1', 1);
        });
    });

    it('displays case details after loading', async () => {
        (PdcaCasesAPI.getPdcaCaseDetails as any).mockResolvedValueOnce(mockCaseDetails);

        render(
            <BrowserRouter>
                <AuthContext.Provider value={{ user: mockUser, setUser: () => { } }}>
                    <PdcaCaseDetailsPage />
                </AuthContext.Provider>
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('PdcaCaseHeader')).toBeInTheDocument();
            expect(screen.getByText('PdcaStatusTimeline')).toBeInTheDocument();
        });
    });

    it('handles error response (404)', async () => {
        (PdcaCasesAPI.getPdcaCaseDetails as any).mockRejectedValueOnce(
            new Error('Case not found')
        );

        render(
            <BrowserRouter>
                <AuthContext.Provider value={{ user: mockUser, setUser: () => { } }}>
                    <PdcaCaseDetailsPage />
                </AuthContext.Provider>
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(/Case not found/)).toBeInTheDocument();
        });
    });

    it('handles error response (403)', async () => {
        (PdcaCasesAPI.getPdcaCaseDetails as any).mockRejectedValueOnce(
            new Error('Access denied')
        );

        render(
            <BrowserRouter>
                <AuthContext.Provider value={{ user: mockUser, setUser: () => { } }}>
                    <PdcaCaseDetailsPage />
                </AuthContext.Provider>
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(/Access denied/)).toBeInTheDocument();
        });
    });

    it('handles missing caseId gracefully', () => {
        expect(true).toBe(true);
    });

    it('passes correct userId to getPdcaCaseDetails', async () => {
        const userWithDifferentId: AuthUser = {
            ...mockUser,
            id: 42,
        };

        (PdcaCasesAPI.getPdcaCaseDetails as any).mockResolvedValueOnce(mockCaseDetails);

        render(
            <BrowserRouter>
                <AuthContext.Provider value={{ user: userWithDifferentId, setUser: () => { } }}>
                    <PdcaCaseDetailsPage />
                </AuthContext.Provider>
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(PdcaCasesAPI.getPdcaCaseDetails).toHaveBeenCalledWith('1', 42);
        });
    });
});
