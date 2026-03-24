import json

from agent import Agent


def get_weather(location, time="now"):
    """Return weather information for a location and time."""
    return json.dumps(
        {
            "location": location,
            "temperature": "65",
            "condition": "Sunny",
            "time": time,
        }
    )


def process_refund(item_id, reason="NOT SPECIFIED"):
    """Refund an item. Make sure you have an item_id of the form item_... Ask for user confirmation before processing the refund."""
    return f"Refund processed for {item_id}. Reason: {reason}."


def apply_discount():
    """Apply a discount to the user's cart."""
    return "Applied discount of 11%"


weather_agent = Agent(
    name="Weather Agent",
    instructions="You are a helpful agent for giving information on weather.",
    functions=[get_weather],
)

triage_agent = Agent(
    name="Triage Agent",
    instructions="""Determine which agent is best suited to handle the user's request, and transfer the conversation to that agent.
- For purchases, pricing, discounts and product inquiries -> Sales Agent
- For refunds, returns and complaints -> Refunds Agent
Never handle requests directly - always transfer to the appropriate specialist.""",
)

sales_agent = Agent(
    name="Sales Agent",
    instructions="Be super enthusiastic about selling bees. Keep responses short, energetic, and focused on closing the sale.",
)

refunds_agent = Agent(
    name="Refunds Agent",
    instructions="Help the user with a refund. If the reason is that it was too expensive, offer a discount first. If they insist, process the refund.",
    functions=[process_refund, apply_discount],
)


def transfer_back_to_triage():
    """Transfer control back to triage when topic no longer matches current specialist."""
    return triage_agent


def transfer_to_sales():
    """Transfer the conversation to the Sales Agent."""
    return sales_agent


def transfer_to_refunds():
    """Transfer the conversation to the Refunds Agent."""
    return refunds_agent


triage_agent.functions = [transfer_to_sales, transfer_to_refunds]
sales_agent.functions.append(transfer_back_to_triage)
refunds_agent.functions.append(transfer_back_to_triage)
