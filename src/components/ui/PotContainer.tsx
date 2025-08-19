import React, { useRef, useState, useEffect } from "react";
import Container from "./Container";
import Ellipsis from "../icons/Ellipsis";
import formatCurrency from "@/app/helpers/formatCurrency";
import PotButton from "./PotButton";
import PopUp from "./PopUp";
import ButtonContent from "./ButtonContent";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePot, editPot } from "@/libs/action";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import Select from "./Select";
import { colors } from "@/db/data";
import { PotType } from "@/app/types";

interface PotContainerProps {
  theme: string;
  name: string;
  total: number;
  target: number;
  id: number;
}

const formSchema = z.object({
  name: z.string().min(1).max(30),
  target: z.number().min(1).positive(),
});

type createPotType = z.infer<typeof formSchema>;

export default function PotContainer({
  theme,
  id,
  name,
  total,
  target,
}: PotContainerProps) {
  const { register, handleSubmit, reset, setValue } = useForm<createPotType>({
    resolver: zodResolver(formSchema),
  });
  const [menuActive, setMenuActive] = useState<boolean>(false);
  const [task, setTask] = useState<"add" | "withdraw" | "edit" | "delete">(
    "add"
  );

  const [elliMenu, setElliMenu] = useState<boolean>(false);
  const elliButtonRef = useRef<HTMLButtonElement | null>(null);
  const elliMenuRef = useRef<HTMLDivElement | null>(null);

  const [changesMade, setChangesMade] = useState<boolean>(false);

  const editPotMutation = useMutation({
    mutationFn: (data: { id: number; pot: PotType }) =>
      editPot(data.id, data.pot),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-pots"] });
      queryClient.invalidateQueries({ queryKey: ["overview"] });
    },
  });

  const onSubmit: SubmitHandler<createPotType> = (data) => {
    const editedPot: PotType = {
      id: id,
      name: data.name,
      target: data.target,
      total: total,
      theme: theme,
    };
    editPotMutation.mutate({ id: id, pot: editedPot });
    setMenuActive(false);
    reset();
  };

  const [themeInput, setThemeInput] = useState<string>("Green");
  const [targetInput, setTargetInput] = useState<number>(0);
  const [nameInput, setNameInput] = useState<string>("");
  const [length, setLength] = useState<number>(30);

  const queryClient = useQueryClient();

  const deletePotMutation = useMutation({
    mutationFn: deletePot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-pots"] });
      queryClient.invalidateQueries({ queryKey: ["overview"] });
    },
  });

  useEffect(() => {
    setLength(30 - name.length);
    setNameInput(name);
    setTargetInput(target);
    setThemeInput(colors.find((cl) => cl.theme === theme)?.name || "Green");
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      if (
        elliMenuRef.current &&
        !elliMenuRef.current.contains(target) &&
        elliButtonRef.current &&
        !elliButtonRef.current.contains(target)
      ) {
        setElliMenu(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setElliMenu(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [setElliMenu]);

  useEffect(() => {
    setChangesMade(
      name !== nameInput || target !== targetInput || theme !== themeInput
    );
  }, [name, nameInput, target, targetInput, theme, themeInput]);

  return (
    <Container className="flex flex-col gap-6">
      <header className="flex items-center gap-4">
        <div
          style={{ background: `${theme}` }}
          className="w-4 aspect-square rounded-full"
        ></div>
        <h1 className="text-lg font-bold">{name}</h1>

        <div className="relative ml-auto">
          <button
            ref={elliButtonRef}
            onClick={() => setElliMenu((prev) => !prev)}
            className="z-10 cursor-pointer text-zinc-400 hover:text-black transition-all duration-200 ease-in-out"
          >
            <Ellipsis />
          </button>
          <div
            ref={elliMenuRef}
            className={`absolute top-full right-0 shadow-[0_4px_10px_rgb(0,0,0,0.6)] bg-white rounded-md min-w-30 text-sm ${
              elliMenu
                ? "opacity-100"
                : "opacity-0 pointer-events-none scale-90"
            } transition-all duration-200 ease-in-out`}
          >
            <button
              onClick={() => {
                setTask("edit");

                setElliMenu(false);
                setMenuActive(true);
              }}
              className="p-2 px-4 cursor-pointer text-zinc-600"
            >
              Edit Pot
            </button>
            <hr className="text-zinc-200 w-[90%] mx-auto"></hr>
            <button
              onClick={() => {
                setTask("delete");
                setElliMenu(false);
                setMenuActive(true);
              }}
              className="p-2 px-4 cursor-pointer whitespace-nowrap text-red-400"
            >
              Delete Pot
            </button>
          </div>
        </div>
      </header>

      <div className="flex items-center justify-between w-full">
        <p className="text-zinc-400 text-sm">Total Saved</p>
        <p className="text-3xl font-bold">{formatCurrency(total)}</p>
      </div>

      <div className="flex flex-col gap-3">
        <div className="w-full h-2 bg-[#f8f4f0] rounded-full overflow-hidden">
          <div
            style={{
              backgroundColor: `${theme}`,
              maxWidth: `100%`,
              width: `${Math.min((total / target) * 100, 100)}%`,
            }}
            className="h-full rounded-full"
          ></div>
        </div>
        <div className=" text-[0.8rem] flex items-center gap-4 justify-between">
          <p className="font-bold text-zinc-700">
            {((total / target) * 100).toFixed(2)}%
          </p>

          <p className="text-zinc-600">Target of {formatCurrency(target)}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <PotButton
          name="+ Add Money"
          onClick={() => {
            setMenuActive(true);
            setTask("add");
          }}
        />
        <PotButton
          name="Withdraw"
          onClick={() => {
            setMenuActive(true);
            setTask("withdraw");
          }}
        />
      </div>

      <PopUp
        active={menuActive}
        setActive={setMenuActive}
        title={
          task === "withdraw"
            ? `Withdraw from '${name}'`
            : task === "add"
            ? `Add to ‘${name}'`
            : task == "edit"
            ? `Edit '${name}'`
            : `Delete '${name}'?`
        }
      >
        <div className="text-zinc-600 text-sm mb-3">
          {task === "add" ? (
            <p>
              Add money to your pot to keep it separate from your main balance.
              As soon as you add this money, it will be deducted from your
              current balance.
            </p>
          ) : task === "withdraw" ? (
            <p>
              Withdraw from your pot to put money back in your main balance.
              This will reduce the amount you have in this pot.
            </p>
          ) : task === "edit" ? (
            <p>If your saving targets change, feel free to update your pots.</p>
          ) : (
            <p>
              Are you sure you want to delete this pot? This action cannot be
              reversed, and all the data inside it will be removed forever.
            </p>
          )}
        </div>

        {(task === "add" || task === "withdraw") && (
          <ButtonContent
            id={id}
            total={total}
            theme={theme}
            target={target}
            task={task}
            setActive={setMenuActive}
          />
        )}

        {task == "delete" && (
          <div className="w-full flex flex-col gap-1">
            <button
              onClick={() => {
                deletePotMutation.mutate(id);
                setMenuActive(false);
              }}
              className="bg-[#c94736] w-full p-4 rounded-md text-white cursor-pointer hover:bg-[#d46c5e] transition-all duration-200 ease-in-out"
            >
              <p className="text-sm font-bold">Yes, Confirm Deletion</p>
            </button>

            <button
              onClick={() => {
                setMenuActive(false);
              }}
              className="w-fit mx-auto cursor-pointer p-3"
            >
              <p className="text-sm">No, Go Back</p>
            </button>
          </div>
        )}

        {task === "edit" && (
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
                defaultValue={nameInput}
                type="text"
                placeholder="Pot Name"
                onKeyDown={(e) => {
                  if (e.key === " " && (name === "" || name.endsWith(" "))) {
                    e.preventDefault();
                  }
                }}
                onChange={(e) => {
                  const value = e.target.value;
                  setNameInput(value);
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
                  defaultValue={targetInput}
                  onFocus={(e) => e.target.select()}
                  autoComplete="off"
                  onChange={(e) => setTargetInput(Number(e.target.value))}
                  className="border w-full outline-0 border-zinc-500 p-3 px-10 rounded-sm cursor-pointer flex items-center justify-between"
                ></input>
                <div className="absolute top-0 h-full left-0 flex items-center justify-center text-zinc-500 w-[7%]">
                  <p>$</p>
                </div>
              </div>
            </div>

            <Select
              selected={themeInput}
              label="Theme"
              setSelected={setThemeInput}
              options={colors.map((color) => color.name)}
              position="top"
            />

            <button
              disabled={
                targetInput <= 0 ||
                nameInput.length === 0 ||
                nameInput.length > 30 ||
                !changesMade
              }
              type="submit"
              className={`text-white bg-black hover:bg-zinc-700 transition-all duration-200 ease-in-out px-6 text-sm p-4 rounded-lg  font-semibold
                        ${
                          targetInput <= 0 ||
                          nameInput.length === 0 ||
                          nameInput.length > 30 ||
                          !changesMade
                            ? "opacity-60 cursor-not-allowed pointer-events-none"
                            : "cursor-pointer opacity-100"
                        }`}
            >
              Edit Pot
            </button>
          </form>
        )}
      </PopUp>
    </Container>
  );
}
