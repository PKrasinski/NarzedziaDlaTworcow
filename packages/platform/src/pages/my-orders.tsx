import { Badge } from "@narzedziadlatworcow.pl/ui/components/ui/badge";
import { useDesignSystem } from "design-system";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@narzedziadlatworcow.pl/ui/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@narzedziadlatworcow.pl/ui/components/ui/table";
import {
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  Receipt,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "../arc-provider";

const MyOrdersPage = () => {
  const { Button } = useDesignSystem();
  const navigate = useNavigate();

  // The new orders view returns individual orders, not a user with orders array
  const [userOrders] = useQuery(
    (q) => q.orders.find({ orderBy: { createdAt: "desc" } }),
    [],
    "user-orders"
  );

  const getStatusBadge = (status: any) => {
    switch (status) {
      case "fulfilled":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            Zakończone
          </Badge>
        );
      case "paid":
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            Opłacone
          </Badge>
        );
      case "pending":
      case "payment_initiated":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            <Clock className="w-3 h-3 mr-1" />
            Oczekujące
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            <XCircle className="w-3 h-3 mr-1" />
            Nieudane
          </Badge>
        );
    }
  };

  const getPaymentMethod = (
    gatewayType: string | undefined | null,
    transactionId: string | undefined | null
  ) => {
    if (gatewayType === "stripe" && transactionId) {
      return "Stripe";
    }
    return gatewayType || "Nieznany";
  };

  const formatPrice = (priceInGroszy: number) => {
    return (priceInGroszy / 100).toFixed(2);
  };

  const getProductName = (item: any) => {
    // Use the name from the order item if available, fallback to productId
    return item.name || item.productId;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center px-6 py-3 bg-white shadow-lg rounded-full text-sm font-medium mb-6 border border-gray-100">
          <Receipt className="w-4 h-4 mr-2 text-blue-500" />
          Moje zamówienia
        </div>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Historia zamówień
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Przeglądaj historię swoich zakupów
        </p>
      </div>

      {/* Orders Table */}
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl">Twoje zamówienia</CardTitle>
          <CardDescription>
            Historia wszystkich zakupionych produktów
          </CardDescription>
        </CardHeader>
        <CardContent>
          {userOrders && userOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Numer</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Nazwa</TableHead>
                    <TableHead>Cena</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Płatność</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userOrders.map((order) => (
                    <TableRow key={order._id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{order._id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {new Date(order.createdAt).toLocaleString("pl-PL")}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {getProductName(order.item)}
                      </TableCell>
                      <TableCell className="font-bold">
                        {formatPrice(order.totalAmount)}zł
                      </TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-gray-400" />
                          {getPaymentMethod(
                            order.gatewayType,
                            order.transactionId
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Brak zamówień
              </h3>
              <p className="text-gray-600 mb-4">
                Nie masz jeszcze żadnych zamówień
              </p>
              <Button
                onClick={() => navigate("/buy-credits")}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Kup pierwsze kredyty
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MyOrdersPage;
