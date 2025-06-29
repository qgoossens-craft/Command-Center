import type { IconDefinition } from './IconService';

// Comprehensive icon database with search capabilities
export class IconDatabase {
    // Expanded icon options - hundreds of icons organized by category
    public static readonly ALL_ICONS: IconDefinition[] = [
        // === DOCUMENTS & FILES ===
        { type: 'emoji', value: '📄', label: 'Document' },
        { type: 'emoji', value: '📝', label: 'Memo' },
        { type: 'emoji', value: '📋', label: 'Clipboard' },
        { type: 'emoji', value: '📊', label: 'Chart' },
        { type: 'emoji', value: '📈', label: 'Graph Up' },
        { type: 'emoji', value: '📉', label: 'Graph Down' },
        { type: 'emoji', value: '📑', label: 'Bookmark Tabs' },
        { type: 'emoji', value: '📒', label: 'Ledger' },
        { type: 'emoji', value: '📓', label: 'Notebook' },
        { type: 'emoji', value: '📔', label: 'Notebook 2' },
        { type: 'emoji', value: '📕', label: 'Red Book' },
        { type: 'emoji', value: '📗', label: 'Green Book' },
        { type: 'emoji', value: '📘', label: 'Blue Book' },
        { type: 'emoji', value: '📙', label: 'Orange Book' },
        { type: 'emoji', value: '📚', label: 'Books' },
        { type: 'emoji', value: '📖', label: 'Open Book' },
        { type: 'emoji', value: '🗂️', label: 'Card Index' },
        { type: 'emoji', value: '🗃️', label: 'Card File Box' },
        { type: 'emoji', value: '🗄️', label: 'File Cabinet' },
        { type: 'emoji', value: '📁', label: 'Folder' },
        { type: 'emoji', value: '📂', label: 'Open Folder' },
        { type: 'emoji', value: '📃', label: 'Page with Curl' },
        { type: 'emoji', value: '📜', label: 'Scroll' },
        
        // === TECHNOLOGY & TOOLS ===
        { type: 'emoji', value: '⚙️', label: 'Settings' },
        { type: 'emoji', value: '🔧', label: 'Wrench' },
        { type: 'emoji', value: '🔨', label: 'Hammer' },
        { type: 'emoji', value: '🛠️', label: 'Tools' },
        { type: 'emoji', value: '⚡', label: 'Lightning' },
        { type: 'emoji', value: '🔌', label: 'Plug' },
        { type: 'emoji', value: '🔋', label: 'Battery' },
        { type: 'emoji', value: '💡', label: 'Light Bulb' },
        { type: 'emoji', value: '🔍', label: 'Search' },
        { type: 'emoji', value: '🔎', label: 'Search Right' },
        { type: 'emoji', value: '🔬', label: 'Microscope' },
        { type: 'emoji', value: '🔭', label: 'Telescope' },
        { type: 'emoji', value: '💻', label: 'Laptop' },
        { type: 'emoji', value: '🖥️', label: 'Desktop' },
        { type: 'emoji', value: '⌨️', label: 'Keyboard' },
        { type: 'emoji', value: '🖱️', label: 'Mouse' },
        { type: 'emoji', value: '🖨️', label: 'Printer' },
        { type: 'emoji', value: '📱', label: 'Phone' },
        { type: 'emoji', value: '📞', label: 'Telephone' },
        { type: 'emoji', value: '☎️', label: 'Phone 2' },
        { type: 'emoji', value: '📟', label: 'Pager' },
        { type: 'emoji', value: '📠', label: 'Fax' },
        { type: 'emoji', value: '💾', label: 'Floppy Disk' },
        { type: 'emoji', value: '💿', label: 'CD' },
        { type: 'emoji', value: '📀', label: 'DVD' },
        { type: 'emoji', value: '💽', label: 'Minidisc' },
        
        // === MEDIA & GRAPHICS ===
        { type: 'emoji', value: '🖼️', label: 'Picture' },
        { type: 'emoji', value: '🎨', label: 'Art' },
        { type: 'emoji', value: '🖌️', label: 'Paintbrush' },
        { type: 'emoji', value: '🖍️', label: 'Crayon' },
        { type: 'emoji', value: '✏️', label: 'Pencil' },
        { type: 'emoji', value: '✒️', label: 'Pen' },
        { type: 'emoji', value: '🖊️', label: 'Pen 2' },
        { type: 'emoji', value: '🖋️', label: 'Fountain Pen' },
        { type: 'emoji', value: '📐', label: 'Ruler' },
        { type: 'emoji', value: '📏', label: 'Straight Ruler' },
        { type: 'emoji', value: '📷', label: 'Camera' },
        { type: 'emoji', value: '📸', label: 'Camera Flash' },
        { type: 'emoji', value: '📹', label: 'Video Camera' },
        { type: 'emoji', value: '🎥', label: 'Movie Camera' },
        { type: 'emoji', value: '📽️', label: 'Film Projector' },
        { type: 'emoji', value: '🎬', label: 'Clapper Board' },
        { type: 'emoji', value: '📺', label: 'Television' },
        { type: 'emoji', value: '📻', label: 'Radio' },
        { type: 'emoji', value: '🎵', label: 'Musical Note' },
        { type: 'emoji', value: '🎶', label: 'Musical Notes' },
        { type: 'emoji', value: '🎤', label: 'Microphone' },
        { type: 'emoji', value: '🎧', label: 'Headphones' },
        { type: 'emoji', value: '🔊', label: 'Speaker' },
        { type: 'emoji', value: '🔉', label: 'Speaker Medium' },
        { type: 'emoji', value: '🔈', label: 'Speaker Low' },
        { type: 'emoji', value: '🔇', label: 'Muted' },
        
        // === STARS & FAVORITES ===
        { type: 'emoji', value: '⭐', label: 'Star' },
        { type: 'emoji', value: '🌟', label: 'Glowing Star' },
        { type: 'emoji', value: '✨', label: 'Sparkles' },
        { type: 'emoji', value: '💫', label: 'Dizzy' },
        { type: 'emoji', value: '❤️', label: 'Heart' },
        { type: 'emoji', value: '💖', label: 'Sparkling Heart' },
        { type: 'emoji', value: '💝', label: 'Heart Box' },
        { type: 'emoji', value: '💎', label: 'Diamond' },
        { type: 'emoji', value: '👑', label: 'Crown' },
        { type: 'emoji', value: '🏆', label: 'Trophy' },
        { type: 'emoji', value: '🥇', label: 'Gold Medal' },
        { type: 'emoji', value: '🥈', label: 'Silver Medal' },
        { type: 'emoji', value: '🥉', label: 'Bronze Medal' },
        { type: 'emoji', value: '🎖️', label: 'Military Medal' },
        { type: 'emoji', value: '🏅', label: 'Sports Medal' },
        
        // === PINS & MARKERS ===
        { type: 'emoji', value: '📌', label: 'Pin' },
        { type: 'emoji', value: '📍', label: 'Round Pin' },
        { type: 'emoji', value: '🗺️', label: 'World Map' },
        { type: 'emoji', value: '🧭', label: 'Compass' },
        { type: 'emoji', value: '📎', label: 'Paperclip' },
        { type: 'emoji', value: '🖇️', label: 'Linked Paperclips' },
        
        // === TIME & CALENDAR ===
        { type: 'emoji', value: '📅', label: 'Calendar' },
        { type: 'emoji', value: '📆', label: 'Tear-off Calendar' },
        { type: 'emoji', value: '🗓️', label: 'Spiral Calendar' },
        { type: 'emoji', value: '⏰', label: 'Alarm Clock' },
        { type: 'emoji', value: '🕐', label: '1 Oclock' },
        { type: 'emoji', value: '⏱️', label: 'Stopwatch' },
        { type: 'emoji', value: '⏲️', label: 'Timer' },
        { type: 'emoji', value: '🕰️', label: 'Mantelpiece Clock' },
        { type: 'emoji', value: '⌚', label: 'Watch' },
        { type: 'emoji', value: '⏳', label: 'Hourglass' },
        { type: 'emoji', value: '⌛', label: 'Hourglass Done' },
        
        // === COMMUNICATION ===
        { type: 'emoji', value: '💬', label: 'Speech Bubble' },
        { type: 'emoji', value: '🗨️', label: 'Left Speech Bubble' },
        { type: 'emoji', value: '🗯️', label: 'Right Anger Bubble' },
        { type: 'emoji', value: '💭', label: 'Thought Bubble' },
        { type: 'emoji', value: '📢', label: 'Loudspeaker' },
        { type: 'emoji', value: '📣', label: 'Megaphone' },
        { type: 'emoji', value: '📯', label: 'Postal Horn' },
        { type: 'emoji', value: '📮', label: 'Postbox' },
        { type: 'emoji', value: '📭', label: 'Open Mailbox' },
        { type: 'emoji', value: '📬', label: 'Open Mailbox Raised' },
        { type: 'emoji', value: '📫', label: 'Closed Mailbox Raised' },
        { type: 'emoji', value: '📪', label: 'Closed Mailbox' },
        { type: 'emoji', value: '📨', label: 'Incoming Envelope' },
        { type: 'emoji', value: '📧', label: 'Email' },
        { type: 'emoji', value: '📩', label: 'Envelope Arrow' },
        { type: 'emoji', value: '✉️', label: 'Envelope' },
        
        // === NATURE & WEATHER ===
        { type: 'emoji', value: '🌞', label: 'Sun' },
        { type: 'emoji', value: '🌝', label: 'Full Moon' },
        { type: 'emoji', value: '🌛', label: 'First Quarter Moon' },
        { type: 'emoji', value: '🌜', label: 'Last Quarter Moon' },
        { type: 'emoji', value: '🌓', label: 'Waxing Crescent' },
        { type: 'emoji', value: '🌔', label: 'Waxing Gibbous' },
        { type: 'emoji', value: '🌕', label: 'Full Moon 2' },
        { type: 'emoji', value: '🌖', label: 'Waning Gibbous' },
        { type: 'emoji', value: '🌗', label: 'Last Quarter' },
        { type: 'emoji', value: '🌘', label: 'Waning Crescent' },
        { type: 'emoji', value: '🌙', label: 'Crescent Moon' },
        { type: 'emoji', value: '☀️', label: 'Sun 2' },
        { type: 'emoji', value: '☁️', label: 'Cloud' },
        { type: 'emoji', value: '⛅', label: 'Sun Behind Cloud' },
        { type: 'emoji', value: '⛈️', label: 'Thunder Cloud' },
        { type: 'emoji', value: '🌤️', label: 'Sun Small Cloud' },
        { type: 'emoji', value: '🌦️', label: 'Sun Behind Rain' },
        { type: 'emoji', value: '🌧️', label: 'Cloud Rain' },
        { type: 'emoji', value: '🔥', label: 'Fire' },
        { type: 'emoji', value: '💧', label: 'Droplet' },
        { type: 'emoji', value: '🌊', label: 'Wave' },
        
        // === GAMES & ENTERTAINMENT ===
        { type: 'emoji', value: '🎲', label: 'Die' },
        { type: 'emoji', value: '🎯', label: 'Direct Hit' },
        { type: 'emoji', value: '🎮', label: 'Video Game' },
        { type: 'emoji', value: '🕹️', label: 'Joystick' },
        { type: 'emoji', value: '🎰', label: 'Slot Machine' },
        { type: 'emoji', value: '🎪', label: 'Circus Tent' },
        { type: 'emoji', value: '🎭', label: 'Performing Arts' },
        { type: 'emoji', value: '🎡', label: 'Ferris Wheel' },
        { type: 'emoji', value: '🎢', label: 'Roller Coaster' },
        { type: 'emoji', value: '🃏', label: 'Joker' },
        { type: 'emoji', value: '🀄', label: 'Mahjong' },
        
        // === NETWORK & INTERNET ===
        { type: 'emoji', value: '🌐', label: 'Globe' },
        { type: 'emoji', value: '🌍', label: 'Earth Africa' },
        { type: 'emoji', value: '🌎', label: 'Earth Americas' },
        { type: 'emoji', value: '🌏', label: 'Earth Asia' },
        { type: 'emoji', value: '🛰️', label: 'Satellite' },
        { type: 'emoji', value: '📡', label: 'Satellite Antenna' },
        { type: 'emoji', value: '🔗', label: 'Link' },
        { type: 'emoji', value: '⛓️', label: 'Chains' },
        { type: 'emoji', value: '🔐', label: 'Locked Key' },
        { type: 'emoji', value: '🔒', label: 'Locked' },
        { type: 'emoji', value: '🔓', label: 'Unlocked' },
        { type: 'emoji', value: '🔑', label: 'Key' },
        { type: 'emoji', value: '🗝️', label: 'Old Key' },
        
        // === CHECKBOXES & STATUS ===
        { type: 'unicode', value: '☐', label: 'Empty Checkbox' },
        { type: 'unicode', value: '☑️', label: 'Checked Box' },
        { type: 'unicode', value: '✅', label: 'Check Mark Button' },
        { type: 'unicode', value: '✓', label: 'Check Mark' },
        { type: 'unicode', value: '✔️', label: 'Heavy Check Mark' },
        { type: 'unicode', value: '✗', label: 'X Mark' },
        { type: 'unicode', value: '✘', label: 'Heavy X Mark' },
        { type: 'unicode', value: '❌', label: 'Cross Mark' },
        { type: 'unicode', value: '❎', label: 'Cross Mark Button' },
        { type: 'unicode', value: '⭕', label: 'Heavy Large Circle' },
        { type: 'unicode', value: '🔴', label: 'Red Circle' },
        { type: 'unicode', value: '🟠', label: 'Orange Circle' },
        { type: 'unicode', value: '🟡', label: 'Yellow Circle' },
        { type: 'unicode', value: '🟢', label: 'Green Circle' },
        { type: 'unicode', value: '🔵', label: 'Blue Circle' },
        { type: 'unicode', value: '🟣', label: 'Purple Circle' },
        { type: 'unicode', value: '⚫', label: 'Black Circle' },
        { type: 'unicode', value: '⚪', label: 'White Circle' },
        { type: 'unicode', value: '◯', label: 'Large Circle' },
        { type: 'unicode', value: '●', label: 'Black Circle 2' },
        { type: 'unicode', value: '○', label: 'White Circle 2' },
        { type: 'unicode', value: '◆', label: 'Black Diamond' },
        { type: 'unicode', value: '◇', label: 'White Diamond' },
        { type: 'unicode', value: '■', label: 'Black Square' },
        { type: 'unicode', value: '□', label: 'White Square' },
        { type: 'unicode', value: '▲', label: 'Black Triangle Up' },
        { type: 'unicode', value: '△', label: 'White Triangle Up' },
        { type: 'unicode', value: '▼', label: 'Black Triangle Down' },
        { type: 'unicode', value: '▽', label: 'White Triangle Down' },
        
        // === ARROWS & NAVIGATION ===
        { type: 'unicode', value: '→', label: 'Right Arrow' },
        { type: 'unicode', value: '←', label: 'Left Arrow' },
        { type: 'unicode', value: '↑', label: 'Up Arrow' },
        { type: 'unicode', value: '↓', label: 'Down Arrow' },
        { type: 'unicode', value: '↗', label: 'Up Right Arrow' },
        { type: 'unicode', value: '↖', label: 'Up Left Arrow' },
        { type: 'unicode', value: '↘', label: 'Down Right Arrow' },
        { type: 'unicode', value: '↙', label: 'Down Left Arrow' },
        { type: 'unicode', value: '↔', label: 'Left Right Arrow' },
        { type: 'unicode', value: '↕', label: 'Up Down Arrow' },
        { type: 'unicode', value: '⇒', label: 'Double Right Arrow' },
        { type: 'unicode', value: '⇐', label: 'Double Left Arrow' },
        { type: 'unicode', value: '⇑', label: 'Double Up Arrow' },
        { type: 'unicode', value: '⇓', label: 'Double Down Arrow' },
        { type: 'unicode', value: '⇔', label: 'Double Left Right Arrow' },
        { type: 'unicode', value: '⇕', label: 'Double Up Down Arrow' },
        { type: 'unicode', value: '➡️', label: 'Right Arrow 2' },
        { type: 'unicode', value: '⬅️', label: 'Left Arrow 2' },
        { type: 'unicode', value: '⬆️', label: 'Up Arrow 2' },
        { type: 'unicode', value: '⬇️', label: 'Down Arrow 2' },
        { type: 'unicode', value: '↩️', label: 'Right Arrow Curving Left' },
        { type: 'unicode', value: '↪️', label: 'Left Arrow Curving Right' },
        { type: 'unicode', value: '⤴️', label: 'Right Arrow Curving Up' },
        { type: 'unicode', value: '⤵️', label: 'Right Arrow Curving Down' },
        { type: 'unicode', value: '🔄', label: 'Counterclockwise Arrows' },
        { type: 'unicode', value: '🔃', label: 'Clockwise Arrows' },
        { type: 'unicode', value: '🔁', label: 'Repeat' },
        { type: 'unicode', value: '🔂', label: 'Repeat Single' },
        
        // === PLAYBACK CONTROLS ===
        { type: 'unicode', value: '▶️', label: 'Play Button' },
        { type: 'unicode', value: '⏸️', label: 'Pause Button' },
        { type: 'unicode', value: '⏹️', label: 'Stop Button' },
        { type: 'unicode', value: '⏺️', label: 'Record Button' },
        { type: 'unicode', value: '⏭️', label: 'Next Track' },
        { type: 'unicode', value: '⏮️', label: 'Last Track' },
        { type: 'unicode', value: '⏩', label: 'Fast Forward' },
        { type: 'unicode', value: '⏪', label: 'Fast Reverse' },
        { type: 'unicode', value: '⏯️', label: 'Play or Pause' },
        { type: 'unicode', value: '🔀', label: 'Shuffle' },
        
        // === SPECIAL SYMBOLS ===
        { type: 'unicode', value: '★', label: 'Star Outline' },
        { type: 'unicode', value: '☆', label: 'White Star' },
        { type: 'unicode', value: '✦', label: 'Black Four Pointed Star' },
        { type: 'unicode', value: '✧', label: 'White Four Pointed Star' },
        { type: 'unicode', value: '✪', label: 'Circled White Star' },
        { type: 'unicode', value: '✫', label: 'Open Centre Black Star' },
        { type: 'unicode', value: '✬', label: 'Black Centre White Star' },
        { type: 'unicode', value: '✭', label: 'Outlined Black Star' },
        { type: 'unicode', value: '✮', label: 'Heavy Outlined Black Star' },
        { type: 'unicode', value: '✯', label: 'Pinwheel Star' },
        { type: 'unicode', value: '♦', label: 'Diamond Suit' },
        { type: 'unicode', value: '♠', label: 'Spade Suit' },
        { type: 'unicode', value: '♥', label: 'Heart Suit' },
        { type: 'unicode', value: '♣', label: 'Club Suit' },
        { type: 'unicode', value: '♤', label: 'White Spade Suit' },
        { type: 'unicode', value: '♡', label: 'White Heart Suit' },
        { type: 'unicode', value: '♢', label: 'White Diamond Suit' },
        { type: 'unicode', value: '♧', label: 'White Club Suit' },
        { type: 'unicode', value: '※', label: 'Reference Mark' },
        { type: 'unicode', value: '‼️', label: 'Double Exclamation' },
        { type: 'unicode', value: '⁉️', label: 'Exclamation Question' },
        { type: 'unicode', value: '❓', label: 'Question Mark' },
        { type: 'unicode', value: '❔', label: 'White Question Mark' },
        { type: 'unicode', value: '❗', label: 'Heavy Exclamation' },
        { type: 'unicode', value: '❕', label: 'White Exclamation' },
        { type: 'unicode', value: '‽', label: 'Interrobang' },
        { type: 'unicode', value: '§', label: 'Section Sign' },
        { type: 'unicode', value: '¶', label: 'Paragraph Sign' },
        { type: 'unicode', value: '‡', label: 'Double Dagger' },
        { type: 'unicode', value: '†', label: 'Dagger' },
        { type: 'unicode', value: '•', label: 'Bullet' },
        { type: 'unicode', value: '‣', label: 'Triangular Bullet' },
        { type: 'unicode', value: '⁃', label: 'Hyphen Bullet' },
        { type: 'unicode', value: '⁌', label: 'Black Leftwards Bullet' },
        { type: 'unicode', value: '⁍', label: 'Black Rightwards Bullet' },
        
        // === PRIORITY & WARNING ===
        { type: 'unicode', value: '!', label: 'Exclamation' },
        { type: 'unicode', value: '!!', label: 'Double Exclamation' },
        { type: 'unicode', value: '!!!', label: 'Triple Exclamation' },
        { type: 'unicode', value: '⚠️', label: 'Warning Sign' },
        { type: 'unicode', value: '🚨', label: 'Police Light' },
        { type: 'unicode', value: '⛔', label: 'No Entry' },
        { type: 'unicode', value: '🚫', label: 'Prohibited' },
        { type: 'unicode', value: '🔞', label: 'No One Under 18' },
        { type: 'unicode', value: '📵', label: 'No Mobile Phones' },
        { type: 'unicode', value: '🚭', label: 'No Smoking' },
        { type: 'unicode', value: '🚯', label: 'No Littering' },
        { type: 'unicode', value: '🚱', label: 'Non-potable Water' },
        { type: 'unicode', value: '🚳', label: 'No Bicycles' },
        { type: 'unicode', value: '🚷', label: 'No Pedestrians' },
        { type: 'unicode', value: '📛', label: 'Name Badge' },
        { type: 'unicode', value: '🔰', label: 'Japanese Symbol for Beginner' },
        
        // === MATHEMATICS & LOGIC ===
        { type: 'unicode', value: '+', label: 'Plus' },
        { type: 'unicode', value: '-', label: 'Minus' },
        { type: 'unicode', value: '×', label: 'Multiplication' },
        { type: 'unicode', value: '÷', label: 'Division' },
        { type: 'unicode', value: '=', label: 'Equals' },
        { type: 'unicode', value: '≠', label: 'Not Equal' },
        { type: 'unicode', value: '≈', label: 'Almost Equal' },
        { type: 'unicode', value: '≡', label: 'Identical' },
        { type: 'unicode', value: '<', label: 'Less Than' },
        { type: 'unicode', value: '>', label: 'Greater Than' },
        { type: 'unicode', value: '≤', label: 'Less Than or Equal' },
        { type: 'unicode', value: '≥', label: 'Greater Than or Equal' },
        { type: 'unicode', value: '±', label: 'Plus Minus' },
        { type: 'unicode', value: '∞', label: 'Infinity' },
        { type: 'unicode', value: '∑', label: 'Sum' },
        { type: 'unicode', value: '∏', label: 'Product' },
        { type: 'unicode', value: '∫', label: 'Integral' },
        { type: 'unicode', value: '∂', label: 'Partial Derivative' },
        { type: 'unicode', value: '∆', label: 'Delta' },
        { type: 'unicode', value: '∇', label: 'Nabla' },
        { type: 'unicode', value: '∈', label: 'Element Of' },
        { type: 'unicode', value: '∉', label: 'Not Element Of' },
        { type: 'unicode', value: '∋', label: 'Contains' },
        { type: 'unicode', value: '∌', label: 'Does Not Contain' },
        { type: 'unicode', value: '∩', label: 'Intersection' },
        { type: 'unicode', value: '∪', label: 'Union' },
        { type: 'unicode', value: '⊂', label: 'Subset' },
        { type: 'unicode', value: '⊃', label: 'Superset' },
        { type: 'unicode', value: '⊆', label: 'Subset or Equal' },
        { type: 'unicode', value: '⊇', label: 'Superset or Equal' },
        { type: 'unicode', value: '∧', label: 'Logical And' },
        { type: 'unicode', value: '∨', label: 'Logical Or' },
        { type: 'unicode', value: '¬', label: 'Not' },
        { type: 'unicode', value: '⊕', label: 'XOR' },
        { type: 'unicode', value: '⊗', label: 'Tensor Product' },
        
        // === CURRENCY & NUMBERS ===
        { type: 'unicode', value: '$', label: 'Dollar' },
        { type: 'unicode', value: '€', label: 'Euro' },
        { type: 'unicode', value: '£', label: 'Pound' },
        { type: 'unicode', value: '¥', label: 'Yen' },
        { type: 'unicode', value: '₿', label: 'Bitcoin' },
        { type: 'unicode', value: '#', label: 'Hash' },
        { type: 'unicode', value: '%', label: 'Percent' },
        { type: 'unicode', value: '‰', label: 'Permille' },
        { type: 'unicode', value: '°', label: 'Degree' },
        { type: 'unicode', value: '′', label: 'Prime' },
        { type: 'unicode', value: '″', label: 'Double Prime' },
        { type: 'unicode', value: '‴', label: 'Triple Prime' },
        { type: 'unicode', value: 'ⁿ', label: 'Superscript n' },
        { type: 'unicode', value: '¹', label: 'Superscript 1' },
        { type: 'unicode', value: '²', label: 'Superscript 2' },
        { type: 'unicode', value: '³', label: 'Superscript 3' },
        { type: 'unicode', value: '⁴', label: 'Superscript 4' },
        { type: 'unicode', value: '⁵', label: 'Superscript 5' },
        { type: 'unicode', value: '½', label: 'Half' },
        { type: 'unicode', value: '⅓', label: 'One Third' },
        { type: 'unicode', value: '¼', label: 'One Quarter' },
        { type: 'unicode', value: '¾', label: 'Three Quarters' },
        { type: 'unicode', value: '⅛', label: 'One Eighth' },
        { type: 'unicode', value: '⅜', label: 'Three Eighths' },
        { type: 'unicode', value: '⅝', label: 'Five Eighths' },
        { type: 'unicode', value: '⅞', label: 'Seven Eighths' }
    ];

    // Category mappings for easy filtering
    public static readonly CATEGORIES = {
        'Documents': ['📄', '📝', '📋', '📊', '📈', '📉', '📑', '📒', '📓', '📔', '📕', '📗', '📘', '📙', '📚', '📖', '🗂️', '🗃️', '🗄️', '📁', '📂', '📃', '📜'],
        'Technology': ['⚙️', '🔧', '🔨', '🛠️', '⚡', '🔌', '🔋', '💡', '🔍', '🔎', '🔬', '🔭', '💻', '🖥️', '⌨️', '🖱️', '🖨️', '📱', '📞', '☎️', '📟', '📠', '💾', '💿', '📀', '💽'],
        'Media': ['🖼️', '🎨', '🖌️', '🖍️', '✏️', '✒️', '🖊️', '🖋️', '📐', '📏', '📷', '📸', '📹', '🎥', '📽️', '🎬', '📺', '📻', '🎵', '🎶', '🎤', '🎧', '🔊', '🔉', '🔈', '🔇'],
        'Stars': ['⭐', '🌟', '✨', '💫', '❤️', '💖', '💝', '💎', '👑', '🏆', '🥇', '🥈', '🥉', '🎖️', '🏅'],
        'Pins': ['📌', '📍', '🗺️', '🧭', '📎', '🖇️'],
        'Time': ['📅', '📆', '🗓️', '⏰', '🕐', '⏱️', '⏲️', '🕰️', '⌚', '⏳', '⌛'],
        'Communication': ['💬', '🗨️', '🗯️', '💭', '📢', '📣', '📯', '📮', '📭', '📬', '📫', '📪', '📨', '📧', '📩', '✉️'],
        'Nature': ['🌞', '🌝', '🌛', '🌜', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘', '🌙', '☀️', '☁️', '⛅', '⛈️', '🌤️', '🌦️', '🌧️', '🔥', '💧', '🌊'],
        'Games': ['🎲', '🎯', '🎮', '🕹️', '🎰', '🎪', '🎭', '🎡', '🎢', '🃏', '🀄'],
        'Network': ['🌐', '🌍', '🌎', '🌏', '🛰️', '📡', '🔗', '⛓️', '🔐', '🔒', '🔓', '🔑', '🗝️'],
        'Status': ['☐', '☑️', '✅', '✓', '✔️', '✗', '✘', '❌', '❎', '⭕', '🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '⚫', '⚪', '◯', '●', '○', '◆', '◇', '■', '□', '▲', '△', '▼', '▽'],
        'Arrows': ['→', '←', '↑', '↓', '↗', '↖', '↘', '↙', '↔', '↕', '⇒', '⇐', '⇑', '⇓', '⇔', '⇕', '➡️', '⬅️', '⬆️', '⬇️', '↩️', '↪️', '⤴️', '⤵️', '🔄', '🔃', '🔁', '🔂'],
        'Controls': ['▶️', '⏸️', '⏹️', '⏺️', '⏭️', '⏮️', '⏩', '⏪', '⏯️', '🔀'],
        'Symbols': ['★', '☆', '✦', '✧', '✪', '✫', '✬', '✭', '✮', '✯', '♦', '♠', '♥', '♣', '♤', '♡', '♢', '♧', '※', '‼️', '⁉️', '❓', '❔', '❗', '❕', '‽', '§', '¶', '‡', '†', '•', '‣', '⁃', '⁌', '⁍'],
        'Priority': ['!', '!!', '!!!', '⚠️', '🚨', '⛔', '🚫', '🔞', '📵', '🚭', '🚯', '🚱', '🚳', '🚷', '📛', '🔰'],
        'Math': ['+', '-', '×', '÷', '=', '≠', '≈', '≡', '<', '>', '≤', '≥', '±', '∞', '∑', '∏', '∫', '∂', '∆', '∇', '∈', '∉', '∋', '∌', '∩', '∪', '⊂', '⊃', '⊆', '⊇', '∧', '∨', '¬', '⊕', '⊗'],
        'Currency': ['$', '€', '£', '¥', '₿', '#', '%', '‰', '°', '′', '″', '‴', 'ⁿ', '¹', '²', '³', '⁴', '⁵', '½', '⅓', '¼', '¾', '⅛', '⅜', '⅝', '⅞']
    };

    /**
     * Search icons by query with fuzzy matching
     */
    public static searchIcons(query: string, limit: number = 50): IconDefinition[] {
        if (!query || query.trim().length === 0) {
            return this.ALL_ICONS.slice(0, limit);
        }

        const searchTerm = query.toLowerCase().trim();
        const results: { icon: IconDefinition; score: number }[] = [];

        for (const icon of this.ALL_ICONS) {
            const label = icon.label.toLowerCase();
            const value = icon.value.toLowerCase();
            const type = icon.type.toLowerCase();

            let score = 0;

            // Exact matches get highest score
            if (label === searchTerm || value === searchTerm) {
                score = 100;
            }
            // Starts with gets high score
            else if (label.startsWith(searchTerm) || value.startsWith(searchTerm)) {
                score = 90;
            }
            // Contains gets medium score
            else if (label.includes(searchTerm) || value.includes(searchTerm) || type.includes(searchTerm)) {
                score = 50;
            }
            // Word boundary matches get bonus points
            else if (this.hasWordBoundaryMatch(label, searchTerm)) {
                score = 70;
            }

            if (score > 0) {
                results.push({ icon, score });
            }
        }

        // Sort by score (descending) and return icons
        return results
            .sort((a, b) => b.score - a.score)
            .slice(0, limit)
            .map(result => result.icon);
    }

    /**
     * Get icons by category
     */
    public static getIconsByCategory(category: string): IconDefinition[] {
        const categoryIcons = this.CATEGORIES[category as keyof typeof this.CATEGORIES];
        if (!categoryIcons) return [];

        return this.ALL_ICONS.filter(icon => categoryIcons.includes(icon.value));
    }

    /**
     * Get all available categories
     */
    public static getCategories(): string[] {
        return Object.keys(this.CATEGORIES);
    }

    /**
     * Check if search term matches word boundaries in text
     */
    private static hasWordBoundaryMatch(text: string, searchTerm: string): boolean {
        const words = text.split(/\s+/);
        return words.some(word => word.startsWith(searchTerm));
    }

    /**
     * Get popular/featured icons (most commonly used)
     */
    public static getPopularIcons(): IconDefinition[] {
        const popularValues = [
            '📄', '📝', '📁', '⭐', '📌', '🔍', '⚙️', '🌓', '📅', '🎲',
            '☐', '✓', '→', '←', '↑', '↓', '●', '◯', '■', '□',
            '!', '!!', '★', '♦', '♠', '♥', '♣', '※', '⚡', '🔥'
        ];

        return this.ALL_ICONS.filter(icon => popularValues.includes(icon.value));
    }
}