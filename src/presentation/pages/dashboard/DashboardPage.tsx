import CategoryGraph from "../../components/dashboard/CategoryGraph"
import Header from "../../components/dashboard/Header"
import RecentTransaction from "../../components/dashboard/RecentTransaction"
import TransactionsBar from "../../components/dashboard/TransactionsBar"
import { mockExpenses } from "../../../assets/asset"
import MostExpense from "../../components/dashboard/MostExpense"
import EmptyStateMostExpense from "../../components/dashboard/EmptyStateMostExpense"


const DashboardPage = () => {

    const topExpenses = [...mockExpenses]?.sort((a, b) => b.amount - a.amount).slice(0, 4);

    const isEmpty = topExpenses.length === 0;

    return (
        <div className='h-[calc(100vh - 64px)] bg-gray-50'>
            <Header /> 

            <div className='w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
                
                <div className='
                    col-span-1
                    md:col-span-2 
                    xl:col-span-2 
                '>
                    <TransactionsBar />

                    {/* Recent transactions */}
                    <RecentTransaction />

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
                            <EmptyStateMostExpense />
                        ):
                        (
                            <div className="grid grid-cols-1 md:grid-cols-2 h-full gap-3 mt-4">
                                {topExpenses.map((expense) => (
                                    <MostExpense key={expense.id} expense={expense} />
                                ))}
                            </div>

                        )}

                    </div>

                    
                </div>

            </div>
        </div>
    )
}

export default DashboardPage
