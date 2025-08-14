import React from "react";
import NavItem from "./NavItem";
import OverviewIcon from "../icons/OverviewIcon";
import TransactionsIcon from "../icons/TransactionsIcon";
import BudgetsIcon from "../icons/BudgetsIcon";
import PotsIcon from "../icons/PotsIcon";
import RecurringIcon from "../icons/RecurringIcon";

export default function Nav({ minimized }: { minimized: boolean }) {
  return (
    <nav className="w-full">
      <ul className="flex flex-col w-full">
        <NavItem
          minimized={minimized}
          name="Overview"
          icon={<OverviewIcon />}
        />
        <NavItem
          minimized={minimized}
          name="Transactions"
          icon={<TransactionsIcon />}
        />
        <NavItem minimized={minimized} name="Budgets" icon={<BudgetsIcon />} />
        <NavItem minimized={minimized} name="Pots" icon={<PotsIcon />} />
        <NavItem
          minimized={minimized}
          name="Recurring bills"
          icon={<RecurringIcon />}
        />
      </ul>
    </nav>
  );
}
