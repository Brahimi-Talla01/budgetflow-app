import AnimatedNumber from "./AnimatedNumber";

interface Chiffre {
    end: number;
    label: string;
    unit: string; 
    colorClass: string; 
}

const OurFigures = () => {

      const chiffresData: Chiffre[] = [
            { 
                  end: 50, 
                  label: "Utilisateurs actifs", 
                  unit: '+', 
                  colorClass: "text-primary",
            },
            { 
                  end: 100, 
                  label: "Budget géré", 
                  unit: 'K+', 
                  colorClass: "text-light",
            },
            { 
                  end: 90, 
                  label: "Satisfaction client", 
                  unit: '%',
                  colorClass: "text-primary",
            }
      ];

      return (
            <section id='feature' className='w-full bg-dark pt-16 pb-20 lg:pt-24 lg:pb-32 scroll-mt-16'>
                  <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>

                        <div className='flex flex-col items-center justify-center text-center mb-12'>
                              <h2 className='bg-primary-flow py-2 px-4 rounded-full text-sm md:text-base my-2 uppercase text-primary font-semibold tracking-wider'>
                                    Nos chiffres
                              </h2>

                              <p className="text-2xl md:text-5xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1] text-center px-4">
                                    Des chiffres qui illustrent notre <span className='text-primary'>impact</span>.
                              </p>
                        </div>


                        <div className='flex justify-center'>
                              <div className='w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-8'>
                              
                              {chiffresData.map((data) => (
                                    <div 
                                          key={data.label} 
                                          className={`p-8 rounded-2xl text-center transition-transform duration-300`}
                                    >
                                          
                                          <p className={`text-5xl md:text-7xl font-extrabold mb-2 ${data.colorClass}`}>
                                          <AnimatedNumber end={data.end} unit={data.unit} /> 
                                          </p>

                                          <p className='text-base font-semibold text-light uppercase tracking-wide'>
                                          {data.label}
                                          </p>
                                    </div>
                              ))}
                              </div>
                        </div>

                  </div>
            </section>
      )
}

export default OurFigures
