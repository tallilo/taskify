"use client";

import { createBoard } from "@/actions/create-board/index";

import { useAction } from "@/app/hooks/use-action";
import { FormInput } from "@/components/form/form-input";
import { FormSubmit } from "@/components/form/form-submit";

export const Form = () => {
  const { execute, FieldErrors } = useAction(createBoard, {
    onSuccess: (data) => {
      console.log(data, "SUCCESS!");
    },
    onError: (error) => {
      console.log(error, "ERROR!");
    },
  });
  const onSubmit = (formData: FormData) => {
    const title = formData.get("title") as string;
    execute({ title });
  };
  return (
    <form action={onSubmit}>
      <div className="flex flex-col space-y-2">
        <FormInput label="Board Title" errors={FieldErrors} id="title" />
      </div>
      <FormSubmit>Save</FormSubmit>
    </form>
  );
};
