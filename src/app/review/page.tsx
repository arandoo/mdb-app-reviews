import { ReviewForm } from "@/components/review-form/review-form";

export const metadata = {
  title: "Review schreiben - MakeDesignerBags",
  description: "Teile deine Erfahrung mit den MakeDesignerBags Kursen",
};

export default function ReviewPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Wie war deine Erfahrung?
          </h1>
          <p className="text-gray-500 mt-2">
            Teile dein Feedback zu den MakeDesignerBags Kursen
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <ReviewForm />
        </div>
      </div>
    </div>
  );
}
