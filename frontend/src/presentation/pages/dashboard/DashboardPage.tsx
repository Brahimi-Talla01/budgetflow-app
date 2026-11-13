import CategoryGraph from "../../components/dashboard/CategoryGraph"
import Header from "../../components/dashboard/Header"
import RecentTransaction from "../../components/dashboard/RecentTransaction"
import TransactionsBar from "../../components/dashboard/TransactionsBar"
import MostExpense from "../../components/dashboard/MostExpense"
import EmptyStateMostExpense from "../../components/dashboard/EmptyStateMostExpense"
import BalanceSummary from "../../components/dashboard/BalanceSummary"
import { useExpenses } from "../../../application/context/expenseContext"
import { useIncomes } from "../../../application/context/incomeContext"
import { useState } from "react"
import AlertBanner, { type FeedbackKind } from "../../components/ui/AlertBanner"
import type { TransactionPayload } from "../../../domain/entities/Expense"
import PageTitle from "../../components/ui/PageTitle"
import { Skeleton } from "../../components/ui/Skeleton"

interface Feedback {
    kind: FeedbackKind;
    message: string;
}

const DashboardPage = () => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const { expenses, loading, createExpense } = useExpenses();
    const { createIncome } = useIncomes();

    const handleSubmit = async (data: TransactionPayload) => {
        const common = {
            amount: data.amount,
            description: data.description,
            date: data.date,
            projectId: data.projectId,
        };

        if (data.type === "expense") {
            const created = await createExpense({ ...common, category: data.category });
            setFeedback(
                created
                    ? { kind: "success", message: "Dépense ajoutée avec succès." }
                    : { kind: "error", message: "Impossible d'ajouter la dépense." }
            );
            return;
        }

        const created = await createIncome({ ...common, source: data.category });
        setFeedback(
            created
                ? { kind: "success", message: "Revenu ajouté avec succès." }
                : { kind: "error", message: "Impossible d'ajouter le revenu." }
        );
    };

    const haveNoExpense = expenses.length === 0;
    
    const topExpenses = [...expenses]?.sort((a, b) => b.amount - a.amount).slice(0, 4);
    
    const isEmpty = topExpenses.length === 0;

    // Ne pas remplacer tout le dashboard par un squelette lors d'une création :
    // le message de retour doit rester visible.
    if (loading && expenses.length === 0) return (
        <>
            <PageTitle title="Dashboard" />
            <div className='mt-6 space-y-4' role="status" aria-label="Chargement du tableau de bord">
                <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
                    <Skeleton className='h-20' />
                    <Skeleton className='h-20' />
                    <Skeleton className='h-20' />
                </div>
                <Skeleton className='h-80' />
                <Skeleton className='h-64' />
            </div>
        </>
    );

    return (
        <>
            <PageTitle title="Dashboard" />
        
            <div className='h-[calc(100vh - 64px)] bg-gray-50 relative overflow-hidden'>
                {/* Background */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary-flow rounded-full blur-3xl opacity-60" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary-flow rounded-full blur-3xl opacity-60" />
                </div>

                <Header
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    onSubmit={handleSubmit}
                /> 

                {feedback && (
                    <AlertBanner
                        kind={feedback.kind}
                        message={feedback.message}
                        onClose={() => setFeedback(null)}
                        className="mt-4"
                    />
                )}

                <div className='w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
                    
                    <div className='
                        col-span-1
                        md:col-span-2 
                        xl:col-span-2 
                    '>
                        <BalanceSummary />
                        <TransactionsBar />

                        {/* Recent transactions */}
                        {haveNoExpense ? (
                            <EmptyStateMostExpense
                                isModalOpen={isModalOpen}
                                setIsModalOpen={setIsModalOpen}
                            />
                        ) : (
                            <RecentTransaction />
                        )}

                    </div>

                    <div className='
                        col-span-1
                        md:col-span-2 
                        xl:col-span-1
                    '>
                        <div className="bg-white p-4 md:p-6 rounded-xl mt-6">
                            <CategoryGraph />
                        </div>

                        {/* La plupart des dépenses */}
                        <div className="bg-white p-4 md:p-6 rounded-xl mt-4">
                            <h1 className="text-sm text-dark">
                                La plupart de vos dépenses
                            </h1>

                            {isEmpty ? (
                                <EmptyStateMostExpense
                                    isModalOpen={isModalOpen}
                                    setIsModalOpen={setIsModalOpen}
                                />
                            ):
                            (
                                <div className="grid grid-cols-1 md:grid-cols-2 h-full gap-3 mt-4">
                                    {topExpenses.map((expense, index) => (
                                        <MostExpense key={index} expense={expense} />
                                    ))}
                                </div>

                            )}

                        </div>

                        
                    </div>

                </div>
            </div>
        </>
    )
}

export default DashboardPage
