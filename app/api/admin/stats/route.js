import dbConnect from "../../utils/dbConnect";
import Order from "../../models/Order";
import User from "../../models/User";

export async function GET(req) {
  try {
    await dbConnect();
    
    // Get total orders
    const totalOrders = await Order.countDocuments();
    
    // Get total revenue
    const revenueResult = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$total" }
        }
      }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;
    
    // Get total customers (unique emails)
    const totalCustomers = await User.countDocuments({ isVerified: true });
    
    // Get orders by status
    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Get recent orders (last 10)
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(10);
    
    // Get revenue by month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const revenueByMonth = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          revenue: { $sum: "$total" },
          orders: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]);
    
    return new Response(JSON.stringify({
      success: true,
      stats: {
        totalOrders,
        totalRevenue,
        totalCustomers,
        ordersByStatus,
        recentOrders,
        revenueByMonth
      }
    }), { status: 200 });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch stats" }), { status: 500 });
  }
}

