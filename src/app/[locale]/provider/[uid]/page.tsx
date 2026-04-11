"use client";

import { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc, collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, Star, Car, Globe, Briefcase, Send } from "lucide-react";
import Link from "next/link";
import StarRating from "@/components/ui/StarRating";
import { formatDistanceToNow } from "date-fns";

interface Provider {
  uid: string;
  name: string;
  email: string;
  bio: string;
  carModel: string;
  carYear: string;
  carColor: string;
  pricePerDay: string;
  pricePerHour: string;
  languages: string[];
  services: string[];
  phone: string;
}

interface Review {
  id: string;
  clientName: string;
  rating: number;
  comment: string;
  createdAt: string;
  routeName: string;
}

export default function ProviderDetailPage({ params }: { params: Promise<{ locale: string; uid: string }> }) {
  const { locale, uid } = use(params);
  const { profile } = useAuth();
  const router = useRouter();

  const [provider, setProvider] = useState<Provider | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    Promise.all([
      getDoc(doc(db, "providers", uid)),
      getDocs(query(collection(db, "reviews"), where("providerId", "==", uid))),
    ]).then(([provSnap, revSnap]) => {
      if (provSnap.exists()) setProvider(provSnap.data() as Provider);
      const revData = revSnap.docs.map(d => ({ id: d.id, ...d.data() } as Review));
      revData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setReviews(revData);
      setLoading(false);
    });
  }, [uid]);

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const handleSubmitReview = async () => {
    if (!profile || !comment.trim()) return;
    setSubmitting(true);
    await addDoc(collection(db, "reviews"), {
      providerId: uid,
      clientId: profile.uid,
      clientName: profile.name,
      rating,
      comment: comment.trim(),
      createdAt: new Date().toISOString(),
      routeName: "",
    });
    setSubmitting(false);
    setSubmitted(true);
    setShowReviewForm(false);
    setComment("");
    setRating(5);
    // Refresh reviews
    const revSnap = await getDocs(query(collection(db, "reviews"), where("providerId", "==", uid)));
    const revData = revSnap.docs.map(d => ({ id: d.id, ...d.data() } as Review));
    revData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setReviews(revData);
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#021a1a", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#2dd4bf", fontFamily: "DM Sans, sans-serif" }}>Loading...</p>
    </div>
  );

  if (!provider) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p>Provider not found</p>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f0f7f7", fontFamily: "DM Sans, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "#021a1a", padding: "0 32px", height: 64, display: "flex", alignItems: "center", gap: 16 }}>
        <button onClick={() => router.back()}
          style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, padding: "8px 14px", cursor: "pointer", color: "white", fontSize: 13, fontFamily: "DM Sans, sans-serif" }}>
          <ArrowLeft size={14} /> Back
        </button>
        <span style={{ fontFamily: "Cormorant Garamond, serif", color: "white", fontSize: 20, fontWeight: 600 }}>Guide Profile</span>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, alignItems: "start" }}>

          {/* Left */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Profile Card */}
            <div style={{ background: "white", borderRadius: 20, padding: 28, boxShadow: "0 4px 24px rgba(4,46,46,0.08)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 20 }}>
                <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, #042e2e, #0a7070)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 28, flexShrink: 0 }}>
                  {provider.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 28, color: "#021a1a", fontWeight: 600, marginBottom: 6 }}>{provider.name}</h1>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <StarRating value={Math.round(avgRating)} readonly size={18} />
                    <span style={{ color: "#4a6060", fontSize: 14 }}>
                      {avgRating > 0 ? `${avgRating.toFixed(1)} (${reviews.length} review${reviews.length !== 1 ? "s" : ""})` : "No reviews yet"}
                    </span>
                  </div>
                </div>
              </div>

              {provider.bio && (
                <p style={{ color: "#4a6060", fontSize: 15, lineHeight: 1.7, marginBottom: 20 }}>{provider.bio}</p>
              )}

              {/* Languages */}
              {provider.languages?.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <Globe size={16} color="#0a7070" />
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#4a6060", textTransform: "uppercase", letterSpacing: "0.1em" }}>Languages</span>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {provider.languages.map(l => (
                      <span key={l} style={{ fontSize: 12, background: "rgba(10,112,112,0.08)", color: "#0a7070", padding: "4px 12px", borderRadius: 999, fontWeight: 500 }}>{l}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Services */}
              {provider.services?.length > 0 && (
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <Briefcase size={16} color="#0a7070" />
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#4a6060", textTransform: "uppercase", letterSpacing: "0.1em" }}>Services</span>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {provider.services.map(s => (
                      <span key={s} style={{ fontSize: 12, background: "rgba(201,168,76,0.1)", color: "#c9a84c", padding: "4px 12px", borderRadius: 999, fontWeight: 500 }}>{s}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Vehicle */}
            {provider.carModel && (
              <div style={{ background: "white", borderRadius: 20, padding: 24, boxShadow: "0 4px 24px rgba(4,46,46,0.08)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <Car size={18} color="#0a7070" />
                  <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, color: "#021a1a", fontWeight: 600 }}>Vehicle</h2>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                  {[
                    { label: "Model", value: provider.carModel },
                    { label: "Year", value: provider.carYear },
                    { label: "Color", value: provider.carColor },
                  ].map(item => (
                    <div key={item.label} style={{ background: "#f8fafa", borderRadius: 12, padding: "12px 16px" }}>
                      <p style={{ color: "#94a3a3", fontSize: 11, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.1em" }}>{item.label}</p>
                      <p style={{ color: "#021a1a", fontSize: 14, fontWeight: 600 }}>{item.value || "—"}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div style={{ background: "white", borderRadius: 20, padding: 24, boxShadow: "0 4px 24px rgba(4,46,46,0.08)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Star size={18} color="#c9a84c" />
                  <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, color: "#021a1a", fontWeight: 600 }}>
                    Reviews ({reviews.length})
                  </h2>
                </div>
                {profile && profile.role === "client" && !submitted && (
                  <button onClick={() => setShowReviewForm(!showReviewForm)}
                    style={{ background: showReviewForm ? "#f8fafa" : "linear-gradient(135deg, #0a7070, #0d9090)", color: showReviewForm ? "#4a6060" : "white", border: showReviewForm ? "1.5px solid #e2eded" : "none", borderRadius: 10, padding: "8px 16px", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "DM Sans, sans-serif" }}>
                    {showReviewForm ? "Cancel" : "Write Review"}
                  </button>
                )}
              </div>

              {/* Review Form */}
              {showReviewForm && (
                <div style={{ background: "#f8fafa", borderRadius: 16, padding: 20, marginBottom: 20, border: "1.5px solid #e2eded" }}>
                  <p style={{ color: "#4a6060", fontSize: 13, fontWeight: 600, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.1em" }}>Your Rating</p>
                  <div style={{ marginBottom: 16 }}>
                    <StarRating value={rating} onChange={setRating} size={28} />
                  </div>
                  <textarea value={comment} onChange={e => setComment(e.target.value)}
                    placeholder="Share your experience with this guide..."
                    rows={4}
                    style={{ width: "100%", padding: "12px 16px", borderRadius: 12, background: "white", border: "1.5px solid #e2eded", color: "#0d1f1f", fontSize: 14, fontFamily: "DM Sans, sans-serif", outline: "none", resize: "vertical", boxSizing: "border-box", marginBottom: 12 }} />
                  <button onClick={handleSubmitReview} disabled={submitting || !comment.trim()}
                    style={{ display: "flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg, #0a7070, #0d9090)", color: "white", border: "none", borderRadius: 10, padding: "10px 20px", cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: "DM Sans, sans-serif" }}>
                    <Send size={14} />
                    {submitting ? "Submitting..." : "Submit Review"}
                  </button>
                </div>
              )}

              {submitted && (
                <div style={{ background: "rgba(10,112,112,0.06)", border: "1px solid rgba(10,112,112,0.2)", borderRadius: 12, padding: "12px 16px", marginBottom: 16, color: "#065050", fontSize: 14 }}>
                  ✓ Thank you for your review!
                </div>
              )}

              {/* Reviews List */}
              {reviews.length === 0 ? (
                <div style={{ textAlign: "center", padding: "32px 0" }}>
                  <Star size={40} color="#e2eded" style={{ marginBottom: 12 }} />
                  <p style={{ color: "#94a3a3", fontSize: 14 }}>No reviews yet. Be the first to review!</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {reviews.map(review => (
                    <div key={review.id} style={{ padding: "16px 0", borderBottom: "1px solid #f0f7f7" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #042e2e, #0a7070)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 14, fontWeight: 700 }}>
                            {review.clientName?.[0]?.toUpperCase()}
                          </div>
                          <div>
                            <p style={{ fontWeight: 600, color: "#021a1a", fontSize: 14 }}>{review.clientName}</p>
                            <p style={{ color: "#94a3a3", fontSize: 11 }}>
                              {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                        <StarRating value={review.rating} readonly size={16} />
                      </div>
                      <p style={{ color: "#4a6060", fontSize: 14, lineHeight: 1.6 }}>{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right - Book */}
          <div style={{ position: "sticky", top: 24 }}>
            <div style={{ background: "white", borderRadius: 20, padding: 24, boxShadow: "0 4px 24px rgba(4,46,46,0.08)" }}>
              <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, color: "#021a1a", marginBottom: 20 }}>Book This Guide</h3>

              {avgRating > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <StarRating value={Math.round(avgRating)} readonly size={16} />
                  <span style={{ color: "#4a6060", fontSize: 13 }}>{avgRating.toFixed(1)} / 5</span>
                </div>
              )}

              {provider.pricePerDay && (
                <div style={{ background: "#f0f7f7", borderRadius: 14, padding: "16px 20px", marginBottom: 16 }}>
                  <p style={{ color: "#94a3a3", fontSize: 12, marginBottom: 4 }}>Starting from</p>
                  <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 32, fontWeight: 700, color: "#021a1a", marginBottom: 2 }}>${provider.pricePerDay}</p>
                  <p style={{ color: "#94a3a3", fontSize: 12 }}>per day</p>
                </div>
              )}

              {provider.pricePerHour && (
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20, padding: "12px 0", borderBottom: "1px solid #f0f7f7" }}>
                  <span style={{ color: "#4a6060", fontSize: 13 }}>Per hour</span>
                  <span style={{ color: "#021a1a", fontSize: 13, fontWeight: 600 }}>${provider.pricePerHour}</span>
                </div>
              )}

              <Link href={`/${locale}/book/${uid}`}
                style={{ display: "block", textAlign: "center", background: "linear-gradient(135deg, #0a7070, #0d9090)", color: "white", padding: "14px", borderRadius: 14, textDecoration: "none", fontSize: 15, fontWeight: 600, fontFamily: "DM Sans, sans-serif", boxShadow: "0 8px 24px rgba(10,112,112,0.3)" }}>
                Book Now
              </Link>

              <p style={{ fontSize: 11, color: "#94a3a3", textAlign: "center", marginTop: 12 }}>No payment required upfront</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}