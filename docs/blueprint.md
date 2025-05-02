# **App Name**: Global Remit Teller

## Core Features:

- UI Modernization: Redesign the existing interface with an iOS-inspired look and feel.
- Responsive Design: Implement a responsive layout using Tailwind CSS to ensure usability across different devices.
- Feature Parity: Maintain all existing functionality of the current system, including user authentication, financial management, transaction processing, customer management, transaction reporting, and payout processing.

## Style Guidelines:

- Primary color: iOS Blue (#0A84FF) for main interactive elements.
- Background color: Light gray (#F2F2F7) to provide a clean, modern look.
- Accent: Use iOS Green (#34C759) to indicate success states and positive actions.
- Utilize rounded corners and subtle shadows for cards and containers to create depth.
- Adopt a minimalist icon style, similar to iOS, for navigation and actions.
- Incorporate subtle animations and transitions for a smooth user experience.

## Original User Request:
# Global Remit Web Interface Specification
## iOS-Inspired UI Redesign with Tailwind CSS

### Executive Summary
This document provides comprehensive specifications for redesigning the Global Remit web interface used by tellers for banking operations. The redesign will adopt Apple iOS design principles while implementing Tailwind CSS for consistent styling and responsive behavior.

### Current System Analysis
The current Global Remit system, identified as version v.0.254.34, provides the following key functionality:

1. **User Authentication**
   - Phone and email-based login
   - Support for multiple country codes (+44, +972)
   - Password management with reset functionality

2. **Financial Management**
   - Multi-currency support (USD, EUR, ILS)
   - Current balance tracking
   - Large-scale transaction handling (evidenced by balances of ~2 billion USD)
   - Negative balance handling (-208,185.77 ILS, -5,230.20 USD)

3. **Transaction Processing**
   - Money transfers (Send Money)
   - Currency exchange with real-time rates (e.g., USD/ILS rate of 3.6900)
   - Client deposits and withdrawals
   - Cash register management

4. **Customer Management**
   - Customer search by multiple identifiers (phone, name, ID, bank account, QR code, customer card)
   - Sender and receiver (beneficiary) management
   - New customer registration

5. **Transaction Reporting**
   - Filtering by date ranges (Today, Yesterday, 30 Days, Last Month, 90 Days, Year to Date, Custom)
   - Transaction categorization (Remittance, Exchange, Client Account, etc.)
   - Breakdown reports by transaction status

6. **Payout Processing**
   - Payout order search
   - Pickup management
   - Operator selection

### Design Goals
1. Modernize the interface with iOS-inspired design principles
2. Improve usability and user experience for tellers
3. Maintain all existing functionality while enhancing visual appeal
4. Ensure responsive design for different device sizes
5. Implement Tailwind CSS for consistent styling
6. Streamline workflows for common teller operations

## Design Specifications

### 1. Color Palette

#### Primary Colors
- **Primary Blue**: `#0A84FF` (iOS blue)
- **Secondary Blue**: `#5AC8FA` (iOS light blue)
- **Success Green**: `#34C759` (iOS green)
- **Warning Orange**: `#FF9500` (iOS orange)
- **Danger Red**: `#FF3B30` (iOS red)
- **Neutral Gray**: `#8E8E93` (iOS gray)

#### Background Colors
- **Light Background**: `#F2F2F7` (iOS light background)
- **White**: `#FFFFFF` (iOS card background)
- **Dark Divider**: `#C6C6C8` (iOS light divider)

#### Text Colors
- **Primary Text**: `#000000` (iOS dark text)
- **Secondary Text**: `#8E8E93` (iOS gray text)
- **Label Text**: `#3C3C43` (iOS label text at 60% opacity)

### 2. Typography

- **Primary Font**: SF Pro Text (or Inter as web alternative)
- **Font Sizes**:
  - Heading 1: 28px (font-bold)
  - Heading 2: 22px (font-semibold)
  - Heading 3: 20px (font-semibold)
  - Body: 17px (font-regular)
  - Caption: 15px (font-regular)
  - Small: 13px (font-regular)

### 3. Component Specifications

#### 3.1 Navigation

**Left Sidebar Navigation**
- Fixed position sidebar with iOS-style icons
- Active state with blue highlight and rounded rectangle background
- Collapsible on smaller screens with slide-out behavior
- Hierarchical navigation structure preserved

**Top Bar**
- Clean white header with subtle shadow
- Currency balances displayed with appropriate positive/negative styling
- User profile with dropdown menu
- Language selector (showing current language flag)

#### 3.2 Cards and Containers

- Rounded corners (14px radius)
- Subtle shadows (box-shadow with low opacity)
- White backgrounds (#FFFFFF)
- Grouped content with iOS-style section headers
- Clear visual hierarchy with consistent spacing

#### 3.3 Form Elements

**Text Inputs**
- Rounded input fields (10px radius)
- Light gray backgrounds (#F2F2F7)
- Clear input labels above fields
- Focus state with blue outline

**Buttons**
- Primary Action: Blue background (#0A84FF), white text, rounded (10px)
- Secondary Action: Light gray background, blue text
- Danger Action: Red background (#FF3B30), white text
- Icon buttons with tooltips

**Dropdowns/Selects**
- iOS-style select elements with rounded appearance
- Custom chevron indicator
- Subtle animation on focus
- Clean dropdown menus with adequate spacing

**Search Fields**
- iOS-style search bars with rounded corners
- Search icon prefixed
- Clear button when text is entered
- Subtle transition animations

#### 3.4 Data Display

**Tables**
- Clean borders and alternating row backgrounds
- Column headers with sort indicators
- iOS-style swipe actions for common operations
- Pagination controls with iOS appearance

**Status Indicators**
- Color-coded status pills (success green, warning orange, danger red)
- iOS-style activity indicators
- Empty state illustrations

**Currency Display**
- Consistent formatting with currency symbols
- Color coding for negative values (red)
- Bold styling for primary amounts

### 4. Screen-by-Screen Specifications

#### 4.1 Login Screen

**Layout**
- Centered card with Global Remit logo
- Clean, minimal design with white background
- iOS-style segmented control for login options (phone/email)

**Components**
- Country code selector with flag icons
- Phone number input with formatting
- Password field with show/hide toggle
- "Log In" primary button
- "Reset password" subtle link
- Error message display with iOS-style alert

#### 4.2 Dashboard/Home

**Layout**
- Welcome section with teller name
- iOS-style card layout for key metrics
- Quick action buttons for common tasks

**Components**
- Currency balance cards with visual indicators
- Recent activity preview (last 5 transactions)
- Quick action buttons for Send Money, Currency Exchange, Deposit
- System notifications with iOS-style appearance

#### 4.3 Send Money

**Layout**
- Multi-step process with iOS-style segmented progress indicator
- Clean form layout with logical grouping

**Components**
1. **Sender Section**
   - Search interface with iOS tab navigation
   - Contact selection with swipe actions
   - "New Sender" button with iOS-style appearance

2. **Receiver Section**
   - Beneficiary selection interface
   - Quick option to use same as sender
   - "New Receiver" button

3. **Transaction Details**
   - Source of funds dropdown
   - Purpose of transfer dropdown
   - Operator selection
   - Transfer type selection

4. **Amount and Payment**
   - Amount input with large, clear display
   - Currency selection with icons
   - Fee display
   - Exchange rate information
   - Total calculation

5. **Confirmation**
   - Transaction summary
   - Terms acceptance checkbox
   - Submit button
   - Cancel option

#### 4.4 Currency Exchange

**Layout**
- Two-panel design showing "Customer To Pay" and "Customer To Receive"
- Clear display of exchange rate
- Quick calculator functionality

**Components**
- Currency selectors with flags and codes
- Amount inputs with auto-calculation
- Exchange rate display with visual indicator if favorable
- System rate information
- Customer search interface
- Confirmation button
- Fee structure display

#### 4.5 Client Balance Management

**Layout**
- Account summary at top
- Tabbed interface for Deposit/Withdrawal operations
- Transaction history below

**Components**
- Balance cards for multiple currencies
- Deposit form with currency selection
- Withdrawal form with availability check
- Account owner search interface
- Transaction history with iOS-style table

#### 4.6 Cash Register

**Layout**
- Clean tabular layout showing all currencies
- Current balance prominently displayed
- Clear register operations

**Components**
- Currency columns (USD, ILS, EUR)
- Opening balance display
- Net payments tracker
- Current balance with timestamp
- "Leave for next shift" input fields
- Clear register buttons with confirmation dialogs

#### 4.7 Transactions

**Layout**
- Powerful filtering interface at top
- Summary statistics and visualizations
- Detailed transaction table below

**Components**
- iOS-style segmented date selector
- Filter chips for active filters
- Search field for transaction lookup
- Breakdown visualization
- Transaction table with swipe actions
- Status indicators using iOS-style pills

#### 4.8 Payout

**Layout**
- Search interface at top
- Pending payouts list
- Payout details panel

**Components**
- Operator selection dropdown
- Search button with iOS styling
- Pickup section for in-person collection
- Payout status indicators
- Action buttons for processing payouts

### 5. Responsive Behavior

- **Desktop**: Full sidebar navigation, multi-column layouts
- **Tablet**: Collapsible sidebar, optimized column layouts
- **Mobile**: Bottom navigation bar, single column stacked layout
- Breakpoints following iOS device dimensions

### 6. Animation and Transitions

- Subtle slide transitions between screens
- Smooth fade for loading states
- iOS-style spring animations for interactive elements
- Button press effects with haptic feedback on supported devices

### 7. Accessibility Considerations

- Color contrast meeting WCAG AA standards
- Keyboard navigation support
- Screen reader compatibility
- Focus indicators for all interactive elements
- Adequate text sizing and spacing

## Implementation Guide

### Tailwind CSS Setup

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'ios-blue': '#0A84FF',
        'ios-light-blue': '#5AC8FA',
        'ios-green': '#34C759',
        'ios-orange': '#FF9500',
        'ios-red': '#FF3B30',
        'ios-gray': '#8E8E93',
        'ios-light-gray': '#F2F2F7',
        'ios-divider': '#C6C6C8',
        'ios-label': 'rgba(60, 60, 67, 0.6)',
      },
      borderRadius: {
        'ios': '10px',
        'ios-card': '14px',
      },
      boxShadow: {
        'ios-card': '0 2px 10px rgba(0, 0, 0, 0.05)',
        'ios-button': '0 1px 2px rgba(0, 0, 0, 0.1)',
      },
      fontFamily: {
        'sf-pro': ['SF Pro Text', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

### Common Component Classes

#### Buttons
```html
<!-- Primary Button -->
<button class="bg-ios-blue text-white rounded-ios px-5 py-2.5 font-medium shadow-ios-button hover:bg-opacity-90 transition-all">
  Primary Action
</button>

<!-- Secondary Button -->
<button class="bg-ios-light-gray text-ios-blue rounded-ios px-5 py-2.5 font-medium shadow-ios-button hover:bg-opacity-90 transition-all">
  Secondary Action
</button>

<!-- Danger Button -->
<button class="bg-ios-red text-white rounded-ios px-5 py-2.5 font-medium shadow-ios-button hover:bg-opacity-90 transition-all">
  Danger Action
</button>
```

#### Input Fields
```html
<div class="mb-4">
  <label class="block text-ios-label text-sm mb-1">Phone Number</label>
  <input type="text" class="w-full bg-ios-light-gray rounded-ios px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-ios-blue">
</div>
```

#### Cards
```html
<div class="bg-white rounded-ios-card shadow-ios-card p-5">
  <h3 class="text-lg font-semibold mb-4">Card Title</h3>
  <div class="card-content">
    <!-- Content goes here -->
  </div>
</div>
```

#### Navigation Item
```html
<a href="#" class="flex items-center px-4 py-3 rounded-ios text-ios-blue hover:bg-ios-light-gray transition-all">
  <svg class="w-5 h-5 mr-3"><!-- Icon SVG --></svg>
  <span>Menu Item</span>
</a>
```

## Migration Strategy

1. **Component Library Development**
   - Develop core Tailwind components matching iOS design
   - Create a comprehensive component documentation
   - Test components for responsive behavior

2. **Phased Implementation**
   - Begin with authentication screens
   - Implement core transaction screens
   - Update supporting screens
   - Apply consistent styling to all reports and tools

3. **Testing Protocol**
   - Usability testing with current tellers
   - Performance testing across devices
   - Accessibility audit
   - Cross-browser compatibility testing

4. **Deployment**
   - Feature flag for new interface
   - Parallel availability of old interface during transition
   - Teller training on new interface
   - Phased rollout across regions

## Conclusion

This specification provides a comprehensive guide for transforming the Global Remit teller interface into a modern, iOS-inspired experience. The implementation of Tailwind CSS will ensure consistency, responsive behavior, and maintainable code while significantly improving the user experience for tellers conducting daily banking operations.

The redesign maintains all existing functionality while bringing a fresh, clean aesthetic that follows Apple's design principles, making the interface more intuitive and visually appealing for users.
  