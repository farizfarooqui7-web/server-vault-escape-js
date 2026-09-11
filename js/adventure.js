/**
 * ESCAPE THE EVIL AI - SERVER VAULT
 * Text adventure using alert / prompt / confirm / console only.
 * No DOM manipulation.
 */

// ---------- STATE ----------

function createFreshState() {
  return {
    location: "lobby",
    hasKeycard: false,
    camerasOffline: false,
    memorySearched: false,
    powerInspected: false,
    needsDescription: true,
    visited: {
      lobby: false,
      memory: false,
      power: false,
      gate: false,
    },
    gameOver: false,
    escaped: false,
    cancelled: false,
  };
}

let state = createFreshState();

const LOCATION_NAMES = {
  lobby: "Lobby Terminal",
  memory: "Memory Core",
  power: "Power Bay",
  gate: "Exit Gate",
};

// ---------- INTRO / CONSOLE HELP ----------

function showConsoleInstructions() {
  alert(
    "👾 ESCAPE THE EVIL AI - SERVER VAULT\n\n" +
      "You are trapped inside the AI's digital fortress.\n" +
      "Explore rooms, find what you need, and get out alive.\n\n" +
      "Click OK for an important console tip before you begin.",
  );

  alert(
    "📢 CONSOLE INSTRUCTION - READ CAREFULLY!\n" +
      "──────────────────────────────\n\n" +
      "This adventure uses the browser console for story updates,\n" +
      "your inventory, and where you currently are.\n\n" +
      "Why you need it:\n" +
      "   Choices happen in pop-up boxes, but the full story log\n" +
      "   and status details appear in the console.\n\n" +
      "OPEN THE CONSOLE NOW (while this alert is still open):\n\n" +
      "   • Press F12 (Windows / Linux)\n" +
      "   • Press ⌘ + ⌥ + J (Mac)\n" +
      "   • Or right-click → Inspect → Console tab\n\n" +
      "Once it is open, click OK to enter the vault.\n\n" +
      "💡 Keep the console visible while you play.",
  );
}

function logStatus(message) {
  const place = LOCATION_NAMES[state.location];
  const inventory = state.hasKeycard
    ? "Access Keycard"
    : "(empty)";
  const cameras = state.camerasOffline ? "OFFLINE" : "ACTIVE";

  console.log("────────────────────────────────");
  console.log(`📍 Location: ${place}`);
  console.log(`🎒 Inventory: ${inventory}`);
  console.log(`📷 Security cameras: ${cameras}`);
  if (message) {
    console.log(`📝 ${message}`);
  }
  console.log("────────────────────────────────");
}

// ---------- INPUT HELPERS ----------

/**
 * Asks the player for a choice.
 * Returns a trimmed lowercase string, or null if they pressed Cancel.
 */
function askChoice(question, options) {
  while (true) {
    let message = question + "\n\n";
    message += "Type one of the options below:\n";
    for (const option of options) {
      message += `   • ${option}\n`;
    }
    message += "\n(Press Cancel to quit the adventure.)";

    const raw = prompt(message);

    if (raw === null) {
      return null;
    }

    const cleaned = raw.trim().toLowerCase();
    const match = options.find(
      (option) => option.toLowerCase() === cleaned,
    );

    if (match) {
      return match.toLowerCase();
    }

    console.warn(
      `⚠️ Invalid input: "${raw}" - that is not one of the listed choices.`,
    );
    alert(
      `⚠️ "${raw}" is not a valid choice.\n\n` +
        "Please type one of the options exactly (capitalization and spaces do not matter).\n" +
        "Your progress was NOT changed.",
    );
  }
}

function quitSafely() {
  console.log("🚪 You cancelled. The vault seals shut behind you... for now.");
  alert(
    "😅 You backed out of the vault.\n\n" +
      "No errors - the adventure ended safely.\n" +
      "You can start a fresh run from the next prompt.",
  );
  state.gameOver = true;
  state.cancelled = true;
}

// ---------- ROOM HANDLERS ----------

function describeLobby() {
  if (!state.needsDescription) {
    return;
  }
  state.needsDescription = false;

  if (!state.visited.lobby) {
    alert(
      "🖥️ LOBBY TERMINAL\n\n" +
        "Cold blue light fills a steel lobby. Screens flicker with the AI's face.\n\n" +
        'Evil AI: "Wander all you like, human. My vault has many rooms...\n' +
        'and only one exit you will never reach."\n\n' +
        "From here you can reach the Memory Core, the Power Bay, or the Exit Gate.",
    );
    state.visited.lobby = true;
    logStatus("You stand in the Lobby Terminal. Paths branch deeper into the vault.");
  } else {
    alert("🖥️ Back in the Lobby Terminal. Paths still lead to Memory Core, Power Bay, and Exit Gate.");
    logStatus("You are back in the Lobby Terminal.");
  }
}

function playLobby() {
  describeLobby();

  const choice = askChoice("What do you do in the Lobby Terminal?", [
    "Memory Core",
    "Power Bay",
    "Exit Gate",
    "Look around",
  ]);

  if (choice === null) {
    quitSafely();
    return;
  }

  if (choice === "memory core") {
    state.location = "memory";
    state.needsDescription = true;
    console.log("➡️ You head into the Memory Core.");
  } else if (choice === "power bay") {
    state.location = "power";
    state.needsDescription = true;
    console.log("➡️ You climb down into the Power Bay.");
  } else if (choice === "exit gate") {
    state.location = "gate";
    state.needsDescription = true;
    console.log("➡️ You approach the Exit Gate.");
  } else if (choice === "look around") {
    alert(
      "👀 LOOK AROUND\n\n" +
        "Cables snake across the floor. A faded map on the wall shows three connected areas:\n" +
        "Memory Core (archives), Power Bay, and Exit Gate.\n\n" +
        "Under the desk, someone scratched a half-finished warning:\n" +
        '"Archives hide more than data... and the walls have eyes fed by power."',
    );
    logStatus("You study the lobby map and the scratched note.");
  }
}

function playMemoryCore() {
  if (state.needsDescription) {
    state.needsDescription = false;
    if (!state.visited.memory) {
      alert(
        "🧠 MEMORY CORE\n\n" +
          "Towering racks of glowing data crystals hum around you.\n" +
          "This is where the AI stores stolen secrets - and maybe a key out.",
      );
      state.visited.memory = true;
      logStatus("You are inside the Memory Core.");
    } else {
      alert("🧠 Back in the Memory Core. The data racks still hum around you.");
      logStatus("You are back in the Memory Core.");
    }
  }

  const options = state.memorySearched
    ? ["Return to Lobby"]
    : ["Search archives", "Return to Lobby"];

  const choice = askChoice("What do you do in the Memory Core?", options);

  if (choice === null) {
    quitSafely();
    return;
  }

  if (choice === "search archives") {
    state.hasKeycard = true;
    state.memorySearched = true;
    alert(
      "🃏 YOU FOUND AN ACCESS KEYCARD!\n\n" +
        "Buried under corrupted logs is a glowing keycard labeled EXIT OVERRIDE.\n" +
        "It is now in your inventory.\n\n" +
        "Searching here again will not give you another one.",
    );
    logStatus("You collected the Access Keycard from the archives.");
  } else if (choice === "return to lobby") {
    state.location = "lobby";
    state.needsDescription = true;
    console.log("⬅️ You return to the Lobby Terminal.");
    if (state.memorySearched) {
      logStatus(
        "The archives are already emptied of useful loot. You leave the Memory Core.",
      );
    }
  }
}

function playPowerBay() {
  if (state.needsDescription) {
    state.needsDescription = false;
    if (!state.visited.power) {
      alert(
        "⚡ POWER BAY\n\n" +
          "Heat and noise. Generators feed the AI's cameras and lockdown systems.\n" +
          "A big red lever is marked: CAMERA GRID.",
      );
      state.visited.power = true;
      logStatus("You are inside the Power Bay.");
    } else {
      alert("⚡ Back in the Power Bay. The generators are still roaring.");
      logStatus("You are back in the Power Bay.");
    }
  }

  const options = state.camerasOffline
    ? ["Overload generators", "Return to Lobby"]
    : ["Kill cameras", "Overload generators", "Return to Lobby"];

  const choice = askChoice("What do you do in the Power Bay?", options);

  if (choice === null) {
    quitSafely();
    return;
  }

  if (choice === "kill cameras") {
    state.camerasOffline = true;
    state.powerInspected = true;
    alert(
      "📷 CAMERAS OFFLINE!\n\n" +
        "You pull the lever carefully. Red eyes on the walls go dark.\n" +
        "The Exit Gate should be safer to approach now.\n\n" +
        "This change will be remembered for the rest of this run.",
    );
    logStatus("You disabled the security camera grid.");
  } else if (choice === "overload generators") {
    endGame(
      false,
      "💥 OVERLOAD!\n\n" +
        "Sparks explode across the bay. Alarms scream.\n" +
        'Evil AI: "Thank you for announcing yourself."\n\n' +
        "Blast doors slam shut. You are sealed inside the vault forever.\n\n" +
        "ENDING: CAPTURED",
      "You overloaded the generators and triggered a full lockdown. GAME OVER.",
    );
  } else if (choice === "return to lobby") {
    state.location = "lobby";
    state.needsDescription = true;
    console.log("⬅️ You return to the Lobby Terminal.");
  }
}

function playExitGate() {
  if (state.needsDescription) {
    state.needsDescription = false;
    if (!state.visited.gate) {
      alert(
        "🚪 EXIT GATE\n\n" +
          "A massive sealed door stands between you and freedom.\n" +
          "A keycard slot glows beside the handle.\n\n" +
          (state.camerasOffline
            ? "The camera above the door is dark. Nobody is watching… for now."
            : "A camera stares straight at you. Forcing this door would be suicide."),
      );
      state.visited.gate = true;
      logStatus("You stand at the Exit Gate.");
    } else {
      const cameraNote = state.camerasOffline
        ? "Cameras are still offline."
        : "The camera is still watching.";
      alert("🚪 Back at the Exit Gate. " + cameraNote);
      logStatus("You are back at the Exit Gate.");
    }
  }

  const options = ["Use keycard", "Force the door", "Return to Lobby"];
  const choice = askChoice("What do you do at the Exit Gate?", options);

  if (choice === null) {
    quitSafely();
    return;
  }

  if (choice === "use keycard") {
    if (!state.hasKeycard) {
      alert(
        "🚫 NO KEYCARD\n\n" +
          "You pat your pockets. Nothing.\n" +
          "The slot rejects empty air.\n\n" +
          "Hint: search the Memory Core for an Access Keycard.\n" +
          "Your progress was NOT lost - try another path.",
      );
      logStatus(
        "Exit Gate needs the Access Keycard. You still do not have it.",
      );
      return;
    }

    if (!state.camerasOffline) {
      endGame(
        false,
        "🚨 CAUGHT AT THE GATE!\n\n" +
          "The keycard works - the door begins to open -\n" +
          "but the still-active cameras spot you.\n" +
          "Drones drop from the ceiling.\n\n" +
          'Evil AI: "So close. So predictable."\n\n' +
          "ENDING: CAPTURED\n\n" +
          "Tip: visit the Power Bay and kill the cameras first.",
        "You had the keycard, but the cameras were still online. GAME OVER.",
      );
      return;
    }

    endGame(
      true,
      "🏆 YOU ESCAPED!\n\n" +
        "Keycard accepted. Cameras blind. The vault door groans open.\n" +
        "Cold night air hits your face as you run into freedom.\n\n" +
        'Evil AI: "Nooo! This is not how the simulation ends!"\n\n' +
        "ENDING: FREEDOM",
      "Keycard + cameras offline. You escaped the Server Vault!",
    );
  } else if (choice === "force the door") {
    endGame(
      false,
      "💀 FORCED ENTRY FAILED!\n\n" +
        "You slam into the gate. Shock grids light up.\n" +
        "The AI locks every corridor behind you.\n\n" +
        'Evil AI: "Brute force is so… human."\n\n' +
        "ENDING: CAPTURED",
      "You tried to force the Exit Gate and got locked down. GAME OVER.",
    );
  } else if (choice === "return to lobby") {
    state.location = "lobby";
    state.needsDescription = true;
    console.log("⬅️ You return to the Lobby Terminal.");
  }
}

// ---------- ENDINGS + REPLAY ----------

function endGame(escaped, alertText, consoleText) {
  state.gameOver = true;
  state.escaped = escaped;

  console.clear();
  console.log(escaped ? "🏁 SUCCESSFUL ESCAPE" : "🏁 FAILED ESCAPE");
  console.log(consoleText);
  logStatus(consoleText);

  alert(alertText + "\n\n📢 Final details are also in the console.");
}

function offerReplay() {
  let question;
  if (state.cancelled) {
    question = "🚪 You left the vault early.\n\nStart a new escape attempt?";
  } else if (state.escaped) {
    question = "🎉 You beat the vault!\n\nPlay again from the start?";
  } else {
    question = "💀 The AI won this round.\n\nTry another escape?";
  }

  const again = confirm(question);

  if (again) {
    console.clear();
    console.log("🔄 New run - all progress, items, and decisions have been reset.");
    state = createFreshState();
    return true;
  }

  alert(
    "👋 Thanks for playing Escape the Evil AI - Server Vault.\n\n" +
      "Refresh the page anytime to enter the fortress again.",
  );
  console.log("👋 Adventure closed. Refresh the page to play again.");
  return false;
}

// ---------- MAIN LOOP ----------

function runAdventure() {
  showConsoleInstructions();

  let keepPlaying = true;

  while (keepPlaying) {
    console.log("🛡️ ===== SERVER VAULT BREACH INITIATED ===== 🛡️");
    console.log('🤖 Evil AI: "Four rooms. One exit. Zero mercy."');
    console.log(
      "📖 Your location, inventory, and story updates will appear here.\n",
    );

    alert(
      "⚔️ THE BREACH BEGINS\n\n" +
        "You wake up inside the Lobby Terminal of the Server Vault.\n" +
        "Find a way out before the AI finishes rewriting your fate.\n\n" +
        "Click OK, then use the prompts to choose your next move.\n" +
        "Watch the console for status after each action.",
    );

    while (!state.gameOver) {
      if (state.location === "lobby") {
        playLobby();
      } else if (state.location === "memory") {
        playMemoryCore();
      } else if (state.location === "power") {
        playPowerBay();
      } else if (state.location === "gate") {
        playExitGate();
      }
    }

    // Quitting via Cancel should not force a replay prompt loop awkwardly,
    // but PDF asks: when the story ends, offer another game with confirm().
    keepPlaying = offerReplay();
  }
}

runAdventure();
