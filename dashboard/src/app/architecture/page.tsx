'use client';

export default function ArchitecturePage() {
    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-10">
                <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">System Architecture</h1>
                <p className="text-gray-400 mt-1.5 tracking-tight">LifeOS multi-model cooperation stack</p>
            </div>

            <div className="glass-card p-2 overflow-hidden">
                <img
                    src="/system-architecture.png"
                    alt="LifeOS Model Architecture — Multi-Model Cooperation Stack"
                    className="w-full h-auto rounded-xl"
                />
            </div>
        </div>
    );
}
