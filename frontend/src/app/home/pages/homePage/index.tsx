import BaseLayout from "../../../../shared/components/BaseLayout";
import styles from "./index.module.css";
import { listItemUser } from "../../../../shared/types/base-layout";
import { useContext, useEffect, useState } from "react";
import { MenuContext } from "../../../../shared/context/menuContext";
import LoadingComponent from "../../../../shared/components/Loading";
import DishComponent from "../../components/dish";
import ItemMenuModel from "../../../admin/models/ItemMenuModel";

const HomePage = () => {
  const {service, state} = useContext(MenuContext);
  const [dayOfferItem, setDayOfferItem] = useState<ItemMenuModel | null>(null);
  
  function bestPromotion(items: ItemMenuModel[]) {
    const bestItem = items.filter(item => item.oldPrice > item.price).sort((a, b) => {
      return a.oldPrice - a.price - (b.oldPrice - b.price)
    })[0]
    setDayOfferItem(bestItem)
    return bestItem;
  }

  useEffect(() => {
    state.getItemsRequestStatus.maybeMap({
      succeeded: (items) => {
        bestPromotion(items)
      }
    })
  }, [state.getItemsRequestStatus]);

  useEffect(() => {
    service.getItems()
  }, [service]);

  return (
    <BaseLayout titlePage="Cardápio" listItem={listItemUser}> 
      {state.getItemsRequestStatus.maybeMap({
        loading: () => <LoadingComponent></LoadingComponent>,
        failed: () => <span>Sem pratos no cardápio!</span>,
        succeeded: (items) => (
          <>
            {
              dayOfferItem && (
                <div className={styles.dayOffer}>
                  <div className={styles.dayOfferContainer}>
                    <h2>{dayOfferItem.name}</h2>
                    <span className={styles.dayOfferOldPrice}>
                      R$ {dayOfferItem.oldPrice.toFixed(2)}
                    </span>
                    <span className={styles.dayOfferPrice}>
                      Por apenas R$ {dayOfferItem.price.toFixed(2)}
                    </span>
                    <span className={styles.dayOfferStatus}>Prato do dia</span>
                  </div>
                  <img src={dayOfferItem.image} alt="img" />
                </div> 
              )
            }
            <div className={styles.dishList}>
              {items.map((item, i) => {
                return <DishComponent item={item} key={i} />
              })}
            </div>
          </>
        )
      })}
    </BaseLayout>
  );
};

export default HomePage;