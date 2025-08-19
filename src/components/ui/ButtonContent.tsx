import formatCurrency from "@/app/helpers/formatCurrency";
import { PotType } from "@/app/types";
import React, { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { editPotAmount } from "@/libs/action";

const formSchema = z.object({
  amount: z.number().min(1).positive(),
});

type FormType = z.infer<typeof formSchema>;

interface ButtonContentProps {
  total: number;
  target: number;
  theme: string;
  id: number;
  task: "add" | "withdraw";
  setActive: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ButtonContent({
  total,
  target,
  theme,
  task,
  id,
  setActive,
}: ButtonContentProps) {
  const { register, handleSubmit, reset, setValue } = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
    },
  });
  const queryClient = useQueryClient();

  const changePotMutation = useMutation({
    mutationFn: (data: {
      id: number;
      task: "add" | "withdraw";
      amount: number;
    }) => editPotAmount(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-pots"] });
      queryClient.invalidateQueries({ queryKey: ["overview"] });
    },
  });

  const onSubmit: SubmitHandler<FormType> = (data) => {
    console.log({
      id: id,
      amount: data.amount,
      task: task,
    });

    changePotMutation.mutate({ id: id, task: task, amount: data.amount });
    setValue("amount", 0);
    setAmount(0);
    setActive(false);
  };

  const inputRef = useRef<HTMLInputElement>(null);

  const [amount, setAmount] = useState<number>(0);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 ">
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500">New Amount</p>

        <p className="text-3xl font-bold">
          {formatCurrency(task === "add" ? total + amount : total - amount)}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <div className="w-full h-2 rounded-full bg-[#f8f4f0]">
          <div
            style={{
              backgroundColor: `${theme}`,
              width: `${
                ((task === "add" ? total + amount : total - amount) / target) *
                100
              }%`,
            }}
            className="h-full w-full rounded-full"
          ></div>
        </div>

        <div className="flex items-center justify-between text-[0.8rem]">
          <p className="text-zinc-500 font-bold">
            {(
              ((task === "add" ? total + amount : total - amount) / target) *
              100
            ).toFixed(2)}
            %
          </p>

          <p className="text-zinc-600">Target of {formatCurrency(target)}</p>
        </div>

        <label htmlFor="amountInput" className="flex flex-col gap-1">
          <p className="text-sm font-bold text-zinc-500">
            Amount to {task === "add" ? "Add" : "Withdraw"}
          </p>

          <div className="w-full relative">
            <input
              {...register("amount", { valueAsNumber: true })}
              autoFocus={true}
              onFocus={(e) => e.target.select()}
              onChange={(e) => setAmount(Number(e.target.value))}
              type="number"
              className="border text-sm w-full outline-0 border-zinc-500 p-2 px-10 rounded-md cursor-pointer flex items-center justify-between"
            ></input>
            <div className="absolute top-0 h-full left-0 flex items-center justify-center text-zinc-500 w-[7%]">
              <p>$</p>
            </div>
          </div>
        </label>
      </div>

      <button
        disabled={amount <= 0}
        className={`text-white bg-black hover:bg-zinc-700 transition-colors duration-200 ease-in-out px-6 text-sm p-4 rounded-lg cursor-pointer font-semibold ${
          amount <= 0
            ? "opacity-50 pointer-events-none cursor-not-allowed"
            : "opacity-100"
        }`}
      >
        {task === "add" ? <p>Confirm Addition</p> : <p>Confirm Withdrawal</p>}
      </button>
    </form>
  );
}
