import OverviewCard from "./components/OverviewCard";
import PackagePieChart from "./components/PackagePieChart";
import CustomLineChart from "./components/CustomLineChart";
import {
  useOverview,
  usePackageSales,
  useSubscriptionChart,
  useOrderChart,
} from "./hooks/usePlatformDashboard";

export default function PlatformDashboardPage() {
  const { data: overview, isLoading: overviewLoading, isError: overviewError } =
    useOverview();
  const {
    data: packageSales,
    isLoading: packageLoading,
    isError: packageError,
  } = usePackageSales();
  const {
    data: subscriptionChart,
    isLoading: subscriptionLoading,
    isError: subscriptionError,
  } = useSubscriptionChart(6);
  const {
    data: orderChart,
    isLoading: orderLoading,
    isError: orderError,
  } = useOrderChart(7);

  const isLoading =
    overviewLoading || packageLoading || subscriptionLoading || orderLoading;

  const isError =
    overviewError || packageError || subscriptionError || orderError;

  if (isLoading) {
    return <div className="p-6">Loading platform dashboard...</div>;
  }

  if (isError || !overview) {
    return <div className="p-6 text-red-500">Failed to load dashboard.</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Platform Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Overview of platform performance and subscriptions
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <OverviewCard title="Total Shops" value={overview.totalShops} />
        <OverviewCard title="Active Shops" value={overview.activeShops} />
        <OverviewCard title="Total Users" value={overview.totalUsers} />
        <OverviewCard title="Total Orders" value={overview.totalOrders} />
        <OverviewCard title="Packages Sold" value={overview.totalPackagesSold} />
        <OverviewCard
          title="Active Subscriptions"
          value={overview.activeSubscriptions}
        />
        <OverviewCard
          title="Pending Requests"
          value={overview.pendingShopRequests}
        />
        <OverviewCard
          title="Approved Requests"
          value={overview.approvedShopRequests}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Package Sales</h2>
          <PackagePieChart data={packageSales?.items ?? []} />
        </div>

        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">
            Subscription Growth (6 months)
          </h2>
          <CustomLineChart data={subscriptionChart?.points ?? []} />
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Orders (Last 7 Days)</h2>
        <CustomLineChart data={orderChart?.points ?? []} />
      </div>
    </div>
  );
}