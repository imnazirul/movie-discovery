import { ExternalLink, Tv } from "lucide-react";
import Image from "next/image";
const TMDB_IMAGE_W200 = "https://image.tmdb.org/t/p/w200";
const WatchProviders = ({ watchProviders }: { watchProviders: any }) => {
  return (
    <>
      {watchProviders &&
        (watchProviders.flatrate ||
          watchProviders.rent ||
          watchProviders.buy) && (
          <div
            className="mt-16 opacity-0 animate-fade-in-up"
            style={{ animationDelay: "320ms" }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Tv className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Where to Watch
              </h2>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 space-y-6">
              {watchProviders.flatrate &&
                watchProviders.flatrate.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                      Stream
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {watchProviders.flatrate.map((provider: any) => (
                        <div
                          key={provider.provider_id}
                          className="relative group"
                        >
                          <Image
                            src={`${TMDB_IMAGE_W200}${provider.logo_path}`}
                            alt={provider.provider_name}
                            width={50}
                            height={50}
                            className="rounded-lg shadow-md hover:scale-110 transition-transform"
                          />
                          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {provider.provider_name}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              {watchProviders.rent && watchProviders.rent.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                    Rent
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {watchProviders.rent.map((provider: any) => (
                      <div
                        key={provider.provider_id}
                        className="relative group"
                      >
                        <Image
                          src={`${TMDB_IMAGE_W200}${provider.logo_path}`}
                          alt={provider.provider_name}
                          width={50}
                          height={50}
                          className="rounded-lg shadow-md hover:scale-110 transition-transform"
                        />
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {provider.provider_name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {watchProviders.buy && watchProviders.buy.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                    Buy
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {watchProviders.buy.map((provider: any) => (
                      <div
                        key={provider.provider_id}
                        className="relative group"
                      >
                        <Image
                          src={`${TMDB_IMAGE_W200}${provider.logo_path}`}
                          alt={provider.provider_name}
                          width={50}
                          height={50}
                          className="rounded-lg shadow-md hover:scale-110 transition-transform"
                        />
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {provider.provider_name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {watchProviders.link && (
                <a
                  href={watchProviders.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary text-sm hover:underline"
                >
                  View all options on JustWatch
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        )}
    </>
  );
};

export default WatchProviders;
