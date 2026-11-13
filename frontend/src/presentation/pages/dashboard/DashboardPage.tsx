import CategoryGraph from "../../components/dashboard/CategoryGraph"
import Header from "../../components/dashboard/Header"
import RecentTransaction from "../../components/dashboard/RecentTransaction"
import TransactionsBar from "../../components/dashboard/TransactionsBar"
import MostExpense from "../../components/dashboard/MostExpense"
import EmptyStateMostExpense from "../../components/dashboard/EmptyStateMostExpense"
import { useExpenses } from "../../../application/context/ExpenseContext"
import { useState } from "react"
import type { ExpenseFormProps } from "../../../domain/entities/Expense"
import PageTitle from "../../components/ui/PageTitle"


export type TransactionType = "expense" | "income";

const DashboardPage = () => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const { expenses, loading, createExpense } = useExpenses();

    const handleSubmit = async (data: ExpenseFormProps, type: TransactionType) => {
        if (type !== "expense") return;

        const dateObj = new Date(data.date);

        const ok = await createExpense({
            amount: Number(data.amount),
            category: data.category,
            description: data.description || undefined,
            date: dateObj.toISOString().split("T")[0],  
            projectId: data.hasProject && data.projectId ? Number(data.projectId) : undefined
        });

        console.log(ok);

        if (!ok) {
            alert("Erreur lors de la création de la dépense");
            return;
        }
    };

    const haveNoExpense = expenses.length === 0;
    
    const topExpenses = [...expenses]?.sort((a, b) => b.amount - a.amount).slice(0, 4);
    
    const isEmpty = topExpenses.length === 0;

    if (loading) return (
        <div className='flex justify-center items-center h-3/4'>
            <span className='w-11 h-11 my-1 rounded-full border-3 border-t-transparent border-primary animate-spin'></span>
        </div>
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

                <div className='w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
                    
                    <div className='
                        col-span-1
                        md:col-span-2 
                        xl:col-span-2 
                    '>
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
