"use client";
import Main from "@/components/ui/Main";
import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addPot, getPots } from "@/libs/action";
import Loading from "@/components/ui/Loading";
import { PotType } from "../types";
import PopUp from "@/components/ui/PopUp";
import PotContainer from "@/components/ui/PotContainer";
import Select from "@/components/ui/Select";
import { colors } from "@/db/data";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  name: z.string().min(1).max(30),
  target: z.number().min(1).positive(),
});

type createPotType = z.infer<typeof formSchema>;

export default function page() {
  const {
    data: pots,
    isPending,
    error,
  } = useQuery({ queryKey: ["get-pots"], queryFn: getPots });
  if (error) return "Error occured while fetching " + error;

  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, setValue } = useForm<createPotType>({
    resolver: zodResolver(formSchema),
  });

  const addPotMutation = useMutation({
    mutationFn: addPot,
    onSuccess: () => {
      console.log("added");
      queryClient.invalidateQueries({ queryKey: ["get-pots"] });
      queryClient.invalidateQueries({ queryKey: ["overview"] });
    },
  });

  const onSubmit: SubmitHandler<createPotType> = (data) => {
    type NewPotType = Omit<PotType, "id">;

    const newPot: NewPotType = {
      theme: theme,
      name: data.name,
      target: data.target,
      total: 0,
    };

    addPotMutation.mutate(newPot);
    setMenuActive(false);
    reset();
    setValue("target", 0);
    setValue("name", "");
    setLength(30);
    setName("");
    setTarget(0);
  };

  const [menuActive, setMenuActive] = useState<boolean>(false);
  const [theme, setTheme] = useState<string>("Green");
  const [target, setTarget] = useState<number>(0);
  const [name, setName] = useState<string>("");
  const [length, setLength] = useState<number>(30);

  if (isPending) return <Loading />;

  return (
    <Main
      pageName="Pots"
      buttonName="Add New Pot"
      onClick={() => {
        setMenuActive(true);
      }}
    >
      <section className="grid grid-cols-2 gap-8">
        {pots.map((pot: PotType, index: number) => (
          <PotContainer
            key={`pot-${index}`}
            target={pot.target}
            theme={pot.theme}
            name={pot.name}
            total={pot.total}
            id={pot.id}
          />
        ))}
      </section>

      <PopUp title="Add New Pot" active={menuActive} setActive={setMenuActive}>
        <p className="text-zinc-600 text-sm">
          Create a pot to set savings targets. These can help keep you on track
          as you save for special purchases.
        </p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="text-sm flex flex-col gap-6 mt-4 w-full"
        >
          <div className="w-full flex flex-col gap-1">
            <label
              htmlFor="potName"
              className="font-bold text-zinc-600 text-[0.8rem]"
            >
              Pot Name
            </label>

            <input
              {...register("name")}
              id="potName"
              autoComplete="off"
              type="text"
              placeholder="Pot Name"
              onKeyDown={(e) => {
                if (e.key === " " && (name === "" || name.endsWith(" "))) {
                  e.preventDefault();
                }
              }}
              onChange={(e) => {
                const value = e.target.value;
                setName(value);
                setLength(30 - value.length);
              }}
              maxLength={30}
              className="p-3 rounded-md w-full border border-black/60 outline-0"
            ></input>
            <div className="w-fit ml-auto">
              <p className="text-[0.8rem] text-zinc-400">
                {length} characters left
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="w-full">
              <p className="text-zinc-600 font-bold text-[0.8rem]">Target</p>
            </label>
            <div className="w-full relative">
              <input
                {...register("target", { valueAsNumber: true })}
                type="number"
                defaultValue={target}
                onFocus={(e) => e.target.select()}
                autoComplete="off"
                onChange={(e) => setTarget(Number(e.target.value))}
                className="border w-full outline-0 border-zinc-500 p-3 px-10 rounded-sm cursor-pointer flex items-center justify-between"
              ></input>
              <div className="absolute top-0 h-full left-0 flex items-center justify-center text-zinc-500 w-[7%]">
                <p>$</p>
              </div>
            </div>
          </div>

          <Select
            selected={theme}
            label="Theme"
            setSelected={setTheme}
            options={colors.map((color) => color.name)}
            position="top"
          />

          <button
            disabled={target <= 0 || name.length === 0 || name.length > 30}
            type="submit"
            className={`text-white bg-black hover:bg-zinc-700 transition-all duration-200 ease-in-out px-6 text-sm p-4 rounded-lg  font-semibold
              ${
                target <= 0 || name.length === 0 || name.length > 30
                  ? "opacity-60 cursor-not-allowed pointer-events-none"
                  : "cursor-pointer opacity-100"
              }`}
          >
            Add Pot
          </button>
        </form>
      </PopUp>
    </Main>
  );
}
