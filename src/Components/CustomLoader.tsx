export default function CustomLoader() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center
      bg-gradient-to-br from-blue-50 via-white to-blue-100">

            <div className="flex flex-col items-center gap-6">

                {/* Brand */}
                <h1 className="text-4xl font-extrabold tracking-wide
          bg-gradient-to-r from-blue-600 to-blue-400
          bg-clip-text text-transparent">
                    Blogify
                </h1>

                {/* Wave Loader */}
                <div className="flex items-end gap-2 h-12">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <span
                            key={i}
                            className="w-3 rounded-full
                bg-gradient-to-t from-blue-600 to-blue-400
                animate-blogify-wave"
                            style={{
                                height: `${20 + i * 6}px`,
                                animationDelay: `${i * 0.12}s`,
                            }}
                        />
                    ))}
                </div>

                {/* Subtitle */}
                <p className="text-sm text-blue-600 tracking-wide">
                    Loading blogs for you...
                </p>
            </div>
        </div>
    );
}
