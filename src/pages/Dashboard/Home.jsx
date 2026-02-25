import React from "react";
import {
  LayoutDashboard,
  BedDouble,
  Users,
  TrendingUp,
  Calendar,
  CheckCircle2,
  Clock,
} from "lucide-react"; // Assuming you use lucide-react for icons

const Home = () => {
  // Fake Data for Dashboard
  const stats = [
    {
      label: "Total Bookings",
      value: "128",
      change: "+12%",
      icon: <Calendar className="w-6 h-6 text-blue-500" />,
    },
    {
      label: "Rooms Occupied",
      value: "42/50",
      change: "84%",
      icon: <BedDouble className="w-6 h-6 text-indigo-500" />,
    },
    {
      label: "Active Guests",
      value: "86",
      change: "+5",
      icon: <Users className="w-6 h-6 text-emerald-500" />,
    },
    {
      label: "Revenue (Today)",
      value: "$12,450",
      change: "+18%",
      icon: <TrendingUp className="w-6 h-6 text-orange-500" />,
    },
  ];

  const recentArrivals = [
    {
      id: "#1024",
      guest: "Sarah Jenkins",
      room: "Suite 404",
      status: "Checked In",
      time: "10:30 AM",
    },
    {
      id: "#1025",
      guest: "Marcus Thorne",
      room: "Deluxe 201",
      status: "Arriving",
      time: "2:00 PM",
    },
    {
      id: "#1026",
      guest: "Elena Rodriguez",
      room: "Standard 105",
      status: "Pending",
      time: "4:15 PM",
    },
  ];


  // main
  return (
    <div className="p-6 bg-slate-50 dark:bg-slate-900 min-h-screen">
      {/* Header */}
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-indigo-600" />
            Data Jeweller
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Welcome back, Concierge. Here’s what’s happening today.
          </p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
          + New Booking
        </button>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-slate-50 dark:bg-slate-700 rounded-lg">
                {stat.icon}
              </div>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                {stat.change}
              </span>
            </div>
            <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              {stat.label}
            </h3>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Arrivals Table */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
            <h2 className="font-bold text-slate-800 dark:text-white">
              Recent Arrivals
            </h2>
            <a
              href="/bookings"
              className="text-xs text-indigo-600 hover:underline font-medium"
            >
              View All
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">Guest</th>
                  <th className="px-6 py-4 font-semibold">Room</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">ETA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {recentArrivals.map((row, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition"
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-900 dark:text-white">
                        {row.guest}
                      </div>
                      <div className="text-xs text-slate-400">{row.id}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                      {row.room}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          row.status === "Checked In"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {row.status === "Checked In" ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {row.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Property Insights Section */}
        <div className="bg-indigo-900 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="font-bold text-xl mb-2">Occupancy Forecast</h2>
            <p className="text-indigo-200 text-sm mb-6">
              Expecting a 15% increase in guests this weekend due to local
              events.
            </p>

            <div className="space-y-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Weekend Peak</span>
                <span>92%</span>
              </div>
              <div className="w-full bg-indigo-800 rounded-full h-2">
                <div
                  className="bg-emerald-400 h-2 rounded-full"
                  style={{ width: "92%" }}
                ></div>
              </div>
            </div>

            <button className="mt-8 w-full bg-white text-indigo-900 font-bold py-2 rounded-lg hover:bg-indigo-50 transition">
              Optimize Pricing
            </button>
          </div>
          {/* Decorative Circle */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-800 rounded-full opacity-50"></div>
        </div>
      </div>
    </div>
  );
};

export default Home;
