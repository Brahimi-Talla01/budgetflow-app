import React from 'react'
import type { RecentTransType } from './RecentTransaction';


type RecentTransactionCardProps = {
      transaction: RecentTransType;
      index: number;
      getCategoryColor: (category: string) => string;
};


const RecentTransactionCard: React.FC<RecentTransactionCardProps> = ({ transaction, index, getCategoryColor }) => {
      return (
            <div 
                  key={index}
                  className='shrink-0 w-[280px] rounded-md p-4 border border-gray-100 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group'
            >
                  {/* Header */}
                  <div className='flex items-start justify-between mb-3'>
                        <div className='flex items-center gap-3'>
                              {/* Icône */}
                              <div className='w-12 h-12 bg-primary-30 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow'>
                                    <transaction.icon className='w-5 h-5 text-gray-400' />
                              </div>
                              
                              {/* Titre */}
                              <div>
                                    <h3 className='font-semibold text-dark text-sm line-clamp-1'>
                                          {transaction.title}
                                    </h3>
                                    <p className='text-xs text-gray-500 mt-0.5'>
                                          {transaction.date}
                                    </p>
                              </div>
                        </div>
                  </div>

                  {/* Montant */}
                  <div className='mb-2'>
                        <p className='text-xl font-bold text-gray-400'>
                              -{transaction.price.toFixed(2)}$
                        </p>
                  </div>

                  {/* Catégorie */}
                  <div className='flex items-center justify-between'>
                        <span className={`text-xs font-medium px-3 py-1 rounded-full ${getCategoryColor(transaction.category)}`}>
                              {transaction.category}
                        </span>
                  </div>
            </div>
      )
}

export default RecentTransactionCard
