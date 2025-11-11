import BrandAnalysisClient from "./BrandAnalysisClient";
import BrandAnalysisTabs from "./BrandAnalysisTabs";

export default function BrandAnalysisPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero section (client) */}
      <BrandAnalysisClient />
      {/* Tabs section (client) */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <BrandAnalysisTabs />
          </div>
        </div>
      </section>
    </div>
  );
}
