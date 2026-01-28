import { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { assets } from '../../../assets/asset';


const AppPreview = () => {
    const [isPlaying, setIsPlaying] = useState<boolean>(true);
    const [isMuted, setIsMuted] = useState<boolean>(true);
    
    // Typage de la référence vidéo
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const togglePlay = (): void => {
        if (videoRef.current) {
            if (isPlaying) videoRef.current.pause();
            else videoRef.current.play();
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = (): void => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const handleRestart = (): void => {
        if (videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play();
            setIsPlaying(true);
        }
    };

    return (
        <div className="relative lg:order-last order-first group">
            {/* Effet de Halo Lumineux en arrière-plan */}
            <div className="absolute -inset-4 bg-linear-to-tr from-blue-500/20 to-purple-500/20 rounded-[4rem] blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>

            <div className="relative mx-auto max-w-[280px] md:max-w-sm">
                
                {/* Phone Frame */}
                <div className="relative z-10 bg-[#0F172A] rounded-[3rem] p-3 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] border-[6px] border-gray-800">
                    
                    {/* Dynamic Island / Notch */}
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-30 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-blue-500/20 mr-1 animate-pulse"></div>
                        <div className="w-1 h-1 rounded-full bg-gray-800"></div>
                    </div>
                
                    {/* Screen Container */}
                    <div className="relative bg-black rounded-[2.2rem] overflow-hidden aspect-[9/19.5] border border-white/5">                                             
                        
                        <video
                            ref={videoRef}
                            src={assets.budgetflow_video}
                            poster={assets.budgetflow}
                            className="w-full h-full object-cover"
                            autoPlay
                            muted
                            loop
                            playsInline
                        />

                        {/* Overlay Gradient */}
                        <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-black/80 to-transparent pointer-events-none opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300"></div>

                        {/* Boutons de Contrôle */}
                        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 z-40">
                            
                            <button 
                                onClick={togglePlay}
                                type="button"
                                className="w-10 h-10 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/20 transition-colors"
                            >
                                {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} className="ml-0.5" fill="currentColor" />}
                            </button>

                            <button 
                                onClick={handleRestart}
                                type="button"
                                className="w-10 h-10 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/20 transition-colors"
                            >
                                <RotateCcw size={18} />
                            </button>

                            <button 
                                onClick={toggleMute}
                                type="button"
                                className="w-10 h-10 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/20 transition-colors"
                            >
                                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Home Indicator */}
                    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-1/3 h-1.5 bg-white/20 rounded-full z-30"></div>
                </div>

                {/* Badge Décoratif */}
                <div className="absolute -right-8 top-1/4 z-20 bg-white p-3 rounded-2xl shadow-xl hidden md:block animate-bounce [animation-duration:3s]">
                     <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                            <Play size={14} fill="currentColor" />
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Status</p>
                            <p className="text-xs font-bold text-gray-900 leading-none">Live Demo</p>
                        </div>
                     </div>
                </div>
            </div>
        </div>
    );
};


export default AppPreview;