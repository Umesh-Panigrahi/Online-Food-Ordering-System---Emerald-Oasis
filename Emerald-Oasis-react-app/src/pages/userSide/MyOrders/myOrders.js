import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useState } from "react/cjs/react.development";
import axios from "axios";
import { useEffect } from "react";
import { URL } from "../../../config";
import UserHeader from "../../../components/UserHeader/userHeader";
import Sidebar from "../../../components/Sidebar/sidebar";
import OrderTile from "../../../components/OrderTile/orderTile";

const styles = {
  conteinar: {
    marginLeft: "250px",
    marginTop: "75px",
    backgroundColor: "rgba(117, 190, 218, 0.5)",
  },
  orderTiles: {
    marginTop: "30px",
  },
  testorderTiles: {
    marginLeft: "95px",
    marginTop: "30px",
  },
  table: {
    border: "4px solid black",
  },
  th: {
    border: "4px solid black",
  },
  td: {
    border: "4px solid black",
  },
};

const MyOrders = (props) => {
  const { userId } = sessionStorage;
  const [requiredPgNum, setRequiredPgNum] = useState(1);
  const [myOrders, setMyOrders] = useState([]);

  const getAllOrders = () => {
    const url = `${URL}/user/order/history/${userId}`;

    axios.get(url).then((response) => {
      const result = response.data;

      if (result["status"] == "success") {
        setMyOrders(result["data"]);
      } else {
        toast.error(result["error"]);
      }
    });
  };

  useEffect(() => {
    getAllOrders();
  }, []);

  var inRange = true;

  const displayNextPgTiles = (e) => {
    requiredPgNum + 1 > lastPage
      ? setRequiredPgNum(1)
      : setRequiredPgNum(requiredPgNum + 1);

    e.preventDefault();
  };

  const displayPrevPgTiles = () => {
    requiredPgNum - 1 > 0
      ? setRequiredPgNum(requiredPgNum - 1)
      : setRequiredPgNum(lastPage);
  };

  var pageCounter = 1;
  var lowerLimit = 0;
  var higherLimit = 1;

  const ordersPerPage = 3; //change this in order to get different number of tiles
  let lastPage = 1;

  return (
    <>
      <div className="container" style={styles.conteinar}>
        <UserHeader />
        <Sidebar />
        <div className="row">
          {myOrders.map((myOrder) => {
            lowerLimit = ordersPerPage * (pageCounter - 1);
            higherLimit = ordersPerPage * pageCounter;
            var inRange =
              myOrder.orderId <= higherLimit
                ? lowerLimit < myOrder.orderId
                : false;
            var result = !inRange
              ? pageCounter++ && (lastPage = pageCounter)
              : pageCounter;

            if (requiredPgNum === pageCounter) {
              return (
                <>
                  <div className="col-4">
                    <OrderTile order={myOrder} />
                  </div>
                </>
              );
            }
          })}
        </div>
        <div className="row">
          <div className="col-2 ">
            <Link
              onClick={displayPrevPgTiles}
              to=""
              style={{
                fontWeight: "bolder",
                fontSize: "1.05em",
                float: "right",
              }}
            >
              Prev Page
            </Link>
          </div>
          <div className="col-4">
            <div
              style={{
                fontWeight: "bolder",
                fontSize: "1.05em",
                float: "right",
              }}
            >
              {requiredPgNum}
            </div>
          </div>
          <div className="col-6">
            <Link
              onClick={displayNextPgTiles}
              to=""
              className="col-3"
              style={{
                fontWeight: "bolder",
                fontSize: "1.05em",
                float: "right",
              }}
            >
              Next Page
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
export default MyOrders;
