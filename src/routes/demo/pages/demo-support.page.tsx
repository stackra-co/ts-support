/**
 * @fileoverview Support Demo Page — interactive utility function playground.
 *
 * Uses HeroUI Tabs to organize demos into sections. Each section
 * demonstrates utility functions with live interactive examples.
 *
 * @module @stackra/ts-support
 * @category Demo
 */

"use client";

import { useState, type ReactElement } from "react";
import { Button, Chip, Tabs, Card, Input } from "@heroui/react";
import { Segment } from "@heroui-pro/react";

/**
 * Main demo page for the support package.
 */
export function DemoSupportPage(): ReactElement {
  const [activeTab, setActiveTab] = useState("str");

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-foreground mb-2">Support Demo</h1>
        <p className="text-sm text-default-500">
          Interactive playground for <code className="text-foreground">@stackra/ts-support</code>.
          Laravel-style utilities: Str, Arr, Num, BaseRegistry, and Collections.
        </p>
      </div>

      {/* Tabbed sections */}
      <Tabs
        selectedKey={activeTab}
        onSelectionChange={(key) => setActiveTab(String(key))}
        aria-label="Support Demo Sections"
      >
        <Tabs.List>
          <Tabs.Tab id="str">Str Helpers</Tabs.Tab>
          <Tabs.Tab id="arr">Arr Helpers</Tabs.Tab>
          <Tabs.Tab id="num">Num Helpers</Tabs.Tab>
          <Tabs.Tab id="registry">Registry</Tabs.Tab>
          <Tabs.Tab id="collections">Collections</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel id="str">
          <StrDemo />
        </Tabs.Panel>
        <Tabs.Panel id="arr">
          <ArrDemo />
        </Tabs.Panel>
        <Tabs.Panel id="num">
          <NumDemo />
        </Tabs.Panel>
        <Tabs.Panel id="registry">
          <RegistryDemo />
        </Tabs.Panel>
        <Tabs.Panel id="collections">
          <CollectionsDemo />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}

/* ── Section: Str Helpers ─────────────────────────────────────── */

function StrDemo(): ReactElement {
  const [input, setInput] = useState("hello_world_example");
  const [method, setMethod] = useState("camel");

  const strMethods: Record<string, (s: string) => string> = {
    camel: (s) => s.replace(/([-_][a-z])/g, (g) => g[1].toUpperCase()),
    kebab: (s) =>
      s
        .replace(/([a-z])([A-Z])/g, "$1-$2")
        .replace(/[_\s]+/g, "-")
        .toLowerCase(),
    snake: (s) =>
      s
        .replace(/([a-z])([A-Z])/g, "$1_$2")
        .replace(/[-\s]+/g, "_")
        .toLowerCase(),
    studly: (s) =>
      s
        .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""))
        .replace(/^./, (c) => c.toUpperCase()),
    title: (s) => s.replace(/\b\w/g, (c) => c.toUpperCase()),
    slug: (s) =>
      s
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
    upper: (s) => s.toUpperCase(),
    lower: (s) => s.toLowerCase(),
    reverse: (s) => s.split("").reverse().join(""),
    ucfirst: (s) => s.charAt(0).toUpperCase() + s.slice(1),
    lcfirst: (s) => s.charAt(0).toLowerCase() + s.slice(1),
    squish: (s) => s.replace(/\s+/g, " ").trim(),
  };

  const result = strMethods[method]?.(input) ?? input;

  return (
    <Card className="p-6 mt-4">
      <h2 className="text-lg font-bold mb-4">Str — String Manipulation</h2>
      <p className="text-sm text-default-500 mb-4">
        70+ string manipulation methods. Type text and select a transformation to see the result in
        real-time.
      </p>

      <Input
        label="Input String"
        value={input}
        onValueChange={setInput}
        className="mb-4"
        description="Type any string to transform"
      />

      <div className="mb-4">
        <h3 className="text-xs font-semibold text-default-500 mb-2">Method:</h3>
        <div className="flex flex-wrap gap-2">
          {Object.keys(strMethods).map((m) => (
            <Button
              key={m}
              size="sm"
              variant={method === m ? "primary" : "secondary"}
              onPress={() => setMethod(m)}
            >
              {m}()
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg border border-default-200 p-4">
          <h4 className="text-xs text-default-500 mb-1">Input:</h4>
          <p className="font-mono text-sm text-default-700">{input || "(empty)"}</p>
        </div>
        <div className="rounded-lg border border-accent/30 bg-accent/5 p-4">
          <h4 className="text-xs text-default-500 mb-1">Str.{method}():</h4>
          <p className="font-mono text-sm text-accent font-medium">{result || "(empty)"}</p>
        </div>
      </div>

      <div className="mt-4 p-3 rounded-lg bg-default-50 text-xs font-mono">
        <span className="text-default-500">// Usage:</span>
        <br />
        {`Str.${method}("${input}") → "${result}"`}
      </div>
    </Card>
  );
}

/* ── Section: Arr Helpers ─────────────────────────────────────── */

function ArrDemo(): ReactElement {
  const [dotPath, setDotPath] = useState("user.address.city");
  const [sampleData] = useState({
    user: {
      name: "John Doe",
      age: 30,
      address: { city: "New York", zip: "10001", country: "US" },
      roles: ["admin", "editor"],
    },
    settings: { theme: "dark", notifications: true },
  });

  const getResult = () => {
    try {
      const parts = dotPath.split(".");
      let current: any = sampleData;
      for (const part of parts) {
        if (current === undefined || current === null) return "undefined";
        if (part === "*" && Array.isArray(current)) {
          return JSON.stringify(current);
        }
        current = current[part];
      }
      return JSON.stringify(current) ?? "undefined";
    } catch {
      return "undefined";
    }
  };

  const examples = [
    "user.name",
    "user.address.city",
    "user.roles",
    "settings.theme",
    "user.address",
    "user.age",
  ];

  return (
    <Card className="p-6 mt-4">
      <h2 className="text-lg font-bold mb-4">Arr — Dot-Notation Access</h2>
      <p className="text-sm text-default-500 mb-4">
        Access nested object properties using dot notation. Supports deep paths, wildcards, and
        fallback values.
      </p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <h3 className="text-xs font-semibold text-default-500 mb-2">Sample Data:</h3>
          <div className="rounded-lg bg-default-50 p-3 font-mono text-[10px] max-h-[200px] overflow-y-auto">
            <pre className="text-default-700">{JSON.stringify(sampleData, null, 2)}</pre>
          </div>
        </div>

        <div>
          <Input
            label="Dot Path"
            value={dotPath}
            onValueChange={setDotPath}
            className="mb-3"
            description="e.g. user.address.city"
          />

          <div className="flex flex-wrap gap-1 mb-3">
            {examples.map((ex) => (
              <Button key={ex} size="sm" variant="tertiary" onPress={() => setDotPath(ex)}>
                {ex}
              </Button>
            ))}
          </div>

          <div className="rounded-lg border border-accent/30 bg-accent/5 p-4">
            <h4 className="text-xs text-default-500 mb-1">Arr.get(data, "{dotPath}"):</h4>
            <p className="font-mono text-sm text-accent font-medium">{getResult()}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 rounded-lg bg-default-50 text-xs font-mono">
        <span className="text-default-500">// Also available:</span>
        <br />
        {'Arr.set(obj, "user.address.zip", "10002")'}
        <br />
        {'Arr.has(obj, "user.name") → true'}
        <br />
        {'Arr.forget(obj, "settings.theme")'}
        <br />
        {'Arr.pluck(users, "name") → ["Alice", "Bob"]'}
      </div>
    </Card>
  );
}

/* ── Section: Num Helpers ─────────────────────────────────────── */

function NumDemo(): ReactElement {
  const [number, setNumber] = useState("1234567.89");
  const [operation, setOperation] = useState("format");

  const numOperations: Record<string, (n: number) => string> = {
    format: (n) => n.toLocaleString("en-US"),
    abbreviate: (n) => {
      if (n >= 1e9) return (n / 1e9).toFixed(1) + "B";
      if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
      if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
      return n.toString();
    },
    currency: (n) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2 }),
    percentage: (n) => (n * 100).toFixed(2) + "%",
    ordinal: (n) => {
      const s = ["th", "st", "nd", "rd"];
      const v = n % 100;
      return n + (s[(v - 20) % 10] || s[v] || s[0]);
    },
    fileSize: (n) => {
      const units = ["B", "KB", "MB", "GB"];
      let i = 0;
      let size = n;
      while (size >= 1024 && i < units.length - 1) {
        size /= 1024;
        i++;
      }
      return size.toFixed(2) + " " + units[i];
    },
  };

  const parsedNumber = parseFloat(number) || 0;
  const result = numOperations[operation]?.(parsedNumber) ?? "";

  return (
    <Card className="p-6 mt-4">
      <h2 className="text-lg font-bold mb-4">Num — Number Formatting</h2>
      <p className="text-sm text-default-500 mb-4">
        Format numbers for display: locale formatting, abbreviation, currency, percentages,
        ordinals, and file sizes.
      </p>

      <div className="flex gap-4 mb-4">
        <Input
          label="Number"
          value={number}
          onValueChange={setNumber}
          className="w-48"
          type="text"
        />
        <div className="flex-1">
          <Segment value={operation} onValueChange={setOperation} aria-label="Number operation">
            <Segment.Item value="format">format</Segment.Item>
            <Segment.Item value="abbreviate">abbreviate</Segment.Item>
            <Segment.Item value="currency">currency</Segment.Item>
            <Segment.Item value="percentage">percentage</Segment.Item>
            <Segment.Item value="ordinal">ordinal</Segment.Item>
            <Segment.Item value="fileSize">fileSize</Segment.Item>
          </Segment>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg border border-default-200 p-4 text-center">
          <h4 className="text-xs text-default-500 mb-1">Input:</h4>
          <p className="font-mono text-lg text-default-700">{parsedNumber}</p>
        </div>
        <div className="rounded-lg border border-accent/30 bg-accent/5 p-4 text-center">
          <h4 className="text-xs text-default-500 mb-1">Num.{operation}():</h4>
          <p className="font-mono text-lg text-accent font-bold">{result}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {[1234, 1500000, 2500000000, 0.756, 42, 1048576].map((n) => (
          <button
            key={n}
            onClick={() => setNumber(n.toString())}
            className="rounded border border-default-100 px-3 py-2 text-xs font-mono hover:border-accent/30 transition-colors"
          >
            {n.toLocaleString()}
          </button>
        ))}
      </div>
    </Card>
  );
}

/* ── Section: Registry ────────────────────────────────────────── */

function RegistryDemo(): ReactElement {
  const [items, setItems] = useState<Record<string, { name: string; version: string }>>({
    react: { name: "React", version: "18.2.0" },
    vue: { name: "Vue", version: "3.4.0" },
  });
  const [newKey, setNewKey] = useState("");
  const [newName, setNewName] = useState("");
  const [newVersion, setNewVersion] = useState("");
  const [lookupKey, setLookupKey] = useState("");
  const [lookupResult, setLookupResult] = useState<string>("");

  const register = () => {
    if (!newKey || !newName) return;
    setItems((prev) => ({ ...prev, [newKey]: { name: newName, version: newVersion || "1.0.0" } }));
    setNewKey("");
    setNewName("");
    setNewVersion("");
  };

  const lookup = () => {
    const item = items[lookupKey];
    setLookupResult(item ? JSON.stringify(item, null, 2) : "undefined (key not found)");
  };

  const remove = (key: string) => {
    setItems((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  return (
    <Card className="p-6 mt-4">
      <h2 className="text-lg font-bold mb-4">BaseRegistry — Key-Value Store</h2>
      <p className="text-sm text-default-500 mb-4">
        Generic registry with O(1) lookups, validation hooks, default items, and lifecycle
        callbacks. Used for plugins, themes, drivers, and more.
      </p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <h3 className="text-xs font-semibold text-default-500 mb-2">Register Item:</h3>
          <div className="space-y-2">
            <Input
              label="Key"
              value={newKey}
              onValueChange={setNewKey}
              placeholder="e.g. angular"
            />
            <Input
              label="Name"
              value={newName}
              onValueChange={setNewName}
              placeholder="e.g. Angular"
            />
            <Input
              label="Version"
              value={newVersion}
              onValueChange={setNewVersion}
              placeholder="e.g. 17.0.0"
            />
            <Button variant="primary" size="sm" onPress={register} isDisabled={!newKey || !newName}>
              Register
            </Button>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-default-500 mb-2">Lookup:</h3>
          <div className="flex gap-2 mb-3">
            <Input label="Key" value={lookupKey} onValueChange={setLookupKey} className="flex-1" />
            <Button variant="secondary" size="sm" onPress={lookup}>
              Get
            </Button>
          </div>
          {lookupResult && (
            <div className="rounded-lg bg-default-50 p-3 font-mono text-xs">
              <pre className="text-default-700">{lookupResult}</pre>
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-default-500 mb-2">
          Registered Items ({Object.keys(items).length}):
        </h3>
        <div className="space-y-1">
          {Object.entries(items).map(([key, item]) => (
            <div
              key={key}
              className="flex items-center justify-between rounded-lg border border-default-100 px-4 py-2"
            >
              <div className="flex items-center gap-2">
                <Chip size="sm" variant="soft" color="accent">
                  {key}
                </Chip>
                <span className="text-sm">{item.name}</span>
                <span className="text-xs text-default-400">v{item.version}</span>
              </div>
              <Button size="sm" variant="tertiary" color="danger" onPress={() => remove(key)}>
                Remove
              </Button>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

/* ── Section: Collections ─────────────────────────────────────── */

function CollectionsDemo(): ReactElement {
  const [items] = useState([
    { id: 1, name: "Alice", age: 28, department: "Engineering" },
    { id: 2, name: "Bob", age: 35, department: "Design" },
    { id: 3, name: "Charlie", age: 24, department: "Engineering" },
    { id: 4, name: "Diana", age: 31, department: "Marketing" },
    { id: 5, name: "Eve", age: 29, department: "Engineering" },
  ]);
  const [operation, setOperation] = useState("filter");
  const [result, setResult] = useState<string>("");

  const operations: Record<string, () => string> = {
    filter: () => {
      const filtered = items.filter((i) => i.department === "Engineering");
      return `collect(items).where("department", "Engineering")\n→ ${JSON.stringify(filtered.map((i) => i.name))}`;
    },
    pluck: () => {
      const names = items.map((i) => i.name);
      return `collect(items).pluck("name")\n→ ${JSON.stringify(names)}`;
    },
    groupBy: () => {
      const grouped: Record<string, string[]> = {};
      items.forEach((i) => {
        if (!grouped[i.department]) grouped[i.department] = [];
        grouped[i.department].push(i.name);
      });
      return `collect(items).groupBy("department")\n→ ${JSON.stringify(grouped, null, 2)}`;
    },
    sortBy: () => {
      const sorted = [...items].sort((a, b) => a.age - b.age);
      return `collect(items).sortBy("age")\n→ ${JSON.stringify(
        sorted.map((i) => `${i.name} (${i.age})`),
        null,
        2,
      )}`;
    },
    sum: () => {
      const total = items.reduce((sum, i) => sum + i.age, 0);
      return `collect(items).sum("age")\n→ ${total}`;
    },
    avg: () => {
      const avg = items.reduce((sum, i) => sum + i.age, 0) / items.length;
      return `collect(items).avg("age")\n→ ${avg.toFixed(1)}`;
    },
    first: () => {
      const first = items.find((i) => i.age > 30);
      return `collect(items).first(i => i.age > 30)\n→ ${JSON.stringify(first)}`;
    },
    chunk: () => {
      const chunks = [];
      for (let i = 0; i < items.length; i += 2) {
        chunks.push(items.slice(i, i + 2).map((x) => x.name));
      }
      return `collect(items).chunk(2)\n→ ${JSON.stringify(chunks)}`;
    },
  };

  const runOperation = (op: string) => {
    setOperation(op);
    setResult(operations[op]?.() ?? "");
  };

  return (
    <Card className="p-6 mt-4">
      <h2 className="text-lg font-bold mb-4">Collections — Chainable Operations</h2>
      <p className="text-sm text-default-500 mb-4">
        Fluent collection API inspired by Laravel. Chain operations like filter, map, groupBy,
        sortBy, and more on arrays of data.
      </p>

      <div className="mb-4">
        <h3 className="text-xs font-semibold text-default-500 mb-2">Sample Data:</h3>
        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <Chip key={item.id} size="sm" variant="bordered">
              {item.name} ({item.age}, {item.department})
            </Chip>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {Object.keys(operations).map((op) => (
          <Button
            key={op}
            size="sm"
            variant={operation === op ? "primary" : "secondary"}
            onPress={() => runOperation(op)}
          >
            .{op}()
          </Button>
        ))}
      </div>

      <div className="rounded-lg bg-default-50 p-4 font-mono text-xs min-h-[100px]">
        {result ? (
          <pre className="text-default-700 whitespace-pre-wrap">{result}</pre>
        ) : (
          <span className="text-default-400">Click an operation to see the result...</span>
        )}
      </div>

      <div className="mt-4 p-3 rounded-lg bg-default-50 text-xs font-mono">
        <span className="text-default-500">// Chainable API:</span>
        <br />
        {'collect(users).where("dept", "Eng").sortBy("age").pluck("name")'}
      </div>
    </Card>
  );
}
