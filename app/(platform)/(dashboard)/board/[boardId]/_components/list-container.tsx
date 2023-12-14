"use client";

import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { ListForm } from "./ListForm";
import { ListWithCards } from "@/types";
import { useEffect, useState } from "react";
import { ListItem } from "./list-item";
import { useAction } from "@/app/hooks/use-action";
import { updateListOrder } from "@/actions/update-list-order";
import { toast } from "sonner";
import { updateCardOrder } from "@/actions/update-card-order";

interface ListContainerProps {
  data: ListWithCards[];
  boardId: string;
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);

  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

export const ListContainer = ({ data, boardId }: ListContainerProps) => {
  const [orderedData, setOrderedData] = useState(data);
  const { execute: executeUpdateListOrder } = useAction(updateListOrder, {
    onSuccess: (data) => {
      toast.success(`List reordered`);
    },
    onError: (error) => {
      toast.error(error);
    },
  });
  const { execute: executeUpdateCardOrder } = useAction(updateCardOrder, {
    onSuccess: (data) => {
      toast.success(`Card reordered`);
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  useEffect(() => {
    setOrderedData(data);
  }, [data]);

  const onDragEnd = (result: any) => {
    const { destination, source, type } = result;
    if (!destination) {
      return;
    }
    //if Drop in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    // User moves a list
    if (type === "list") {
      const items = reorder(orderedData, source.index, destination.index).map(
        (item, index) => ({ ...item, order: index })
      );
      setOrderedData(items);
      executeUpdateListOrder({ items, boardId });
    }
    //User moves a Card
    if (type === "card") {
      let newOrderedData = [...orderedData];

      // Source and destination list

      const sourceList = newOrderedData.find(
        (list) => list.id === source.droppableId
      );
      const destinationList = newOrderedData.find(
        (list) => list.id === destination.droppableId
      );

      if (!sourceList || !destinationList) {
        return;
      }
      // Check if cards exist on the source list
      if (!sourceList.cards) {
        sourceList.cards = [];
      }
      // Check if cards exists on the destination list
      if (!destinationList.cards) {
        destinationList.cards = [];
      }
      /// Moving the card in the same list
      if (source.droppableId === destination.droppableId) {
        const reorderedCards = reorder(
          sourceList.cards,
          source.index,
          destination.index
        );
        reorderedCards.forEach((card, index) => {
          card.order = index;
        });
        sourceList.cards = reorderedCards;
        setOrderedData(newOrderedData);
        //TODO: Triger server action
        executeUpdateCardOrder({ boardId, items: reorderedCards });
      }
      //User moves the card to another list
      else {
        //Remove Card from the source list
        const [movedCard] = sourceList.cards.splice(source.index, 1);
        //Assign the new listId to the moved card
        movedCard.listId = destination.droppableId;
        // Add card to the destination list
        destinationList.cards.splice(destination.index, 0, movedCard);
        sourceList.cards.forEach((card, index) => {
          card.order = index;
        });

        /// Update the order for each card in the destination list
        destinationList.cards.forEach((card, index) => {
          card.order = index;
        });
        setOrderedData(newOrderedData);
        // TODO: Triger server action
        executeUpdateCardOrder({ boardId, items: destinationList.cards });
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="list" direction="horizontal" type="list">
        {(provided) => (
          <ol
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex gap-x-3 h-full"
          >
            {orderedData.map((list, index) => {
              return <ListItem key={list.id} index={index} data={list} />;
            })}
            {provided.placeholder}
            <ListForm />
            <div className="flex-shrink-0 w-1" />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
};
