import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { AdminLayout } from "./components/admin/AdminLayout";
import { AboutPage } from "./pages/AboutPage";
import { BookingPage } from "./pages/BookingPage";
import { ContactPage } from "./pages/ContactPage";
import { GalleryPage } from "./pages/GalleryPage";
import { HomePage } from "./pages/HomePage";
import { ReviewsPage } from "./pages/ReviewsPage";
import { RoomsPage } from "./pages/RoomsPage";
import { ServicesPage } from "./pages/ServicesPage";
import { AdminAvailabilityPage } from "./pages/admin/AdminAvailabilityPage";
import { AdminBookingsPage } from "./pages/admin/AdminBookingsPage";
import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage";
import { AdminLoginPage } from "./pages/admin/AdminLoginPage";
import { AdminMessagesPage } from "./pages/admin/AdminMessagesPage";
import { AdminReviewsPage } from "./pages/admin/AdminReviewsPage";
import { AdminRoomsPage } from "./pages/admin/AdminRoomsPage";
import { AdminStaffPage } from "./pages/admin/AdminStaffPage";
import { RequireStaff } from "./pages/admin/RequireStaff";

export default function App() {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route element={<RequireStaff />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="bookings" replace />} />
          <Route path="bookings" element={<AdminBookingsPage />} />
          <Route path="availability" element={<AdminAvailabilityPage />} />
          <Route element={<RequireStaff roles={["admin"]} />}>
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="rooms" element={<AdminRoomsPage />} />
            <Route path="reviews" element={<AdminReviewsPage />} />
            <Route path="messages" element={<AdminMessagesPage />} />
            <Route path="staff" element={<AdminStaffPage />} />
          </Route>
        </Route>
      </Route>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="rooms" element={<RoomsPage />} />
        <Route path="book" element={<BookingPage />} />
        <Route path="gallery" element={<GalleryPage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="reviews" element={<ReviewsPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
