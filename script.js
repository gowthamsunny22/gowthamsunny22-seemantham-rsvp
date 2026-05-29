// EDIT EVENT DETAILS HERE LATER
const eventDetails = {
  parentsName: "Pooja & Dinesh",
  eventDate: "Saturday, June 27, 2026",
  eventTime: "5:00 PM onwards",
  eventVenue: "Austin, TX"
};

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyOHheyq2481aSkMOt6-5yUCQEQfHMBNl7YI-YAG_aHuljcNU60DzhrE9rxsxXHmzJtzg/exec";

const parentsNameEl = document.getElementById("parentsName");
const eventDateEl = document.getElementById("eventDate");
const eventTimeEl = document.getElementById("eventTime");
const eventVenueEl = document.getElementById("eventVenue");

parentsNameEl.textContent = eventDetails.parentsName;
eventDateEl.textContent = eventDetails.eventDate;
eventTimeEl.textContent = eventDetails.eventTime;
eventVenueEl.textContent = eventDetails.eventVenue;

let attendingStatus = "Yes";
let guestCount = 1;

const guestCountEl = document.getElementById("guestCount");
const plusBtn = document.getElementById("plusBtn");
const minusBtn = document.getElementById("minusBtn");
const choiceButtons = document.querySelectorAll(".choice");
const form = document.getElementById("rsvpForm");
const statusMessage = document.getElementById("statusMessage");
const submitBtn = document.querySelector(".submit-btn");

choiceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    choiceButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    attendingStatus = button.dataset.value;

    if (attendingStatus === "No") {
      guestCount = 0;
      guestCountEl.textContent = guestCount;
    } else if (guestCount === 0) {
      guestCount = 1;
      guestCountEl.textContent = guestCount;
    }
  });
});

plusBtn.addEventListener("click", () => {
  if (attendingStatus === "No") return;
  if (guestCount < 20) guestCount++;
  guestCountEl.textContent = guestCount;
});

minusBtn.addEventListener("click", () => {
  const minimum = attendingStatus === "No" ? 0 : 1;
  if (guestCount > minimum) guestCount--;
  guestCountEl.textContent = guestCount;
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const guestName = document.getElementById("guestName").value.trim();

  if (!guestName) {
    showStatus("Please enter your name.", "error");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting...";
  showStatus("", "");

  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify({
        name: guestName,
        attending: attendingStatus,
        guests: guestCount,
        source: "Seemantham Invitation"
      })
    });

    showStatus("Thank you! Your RSVP has been submitted successfully.", "success");
    form.reset();
    attendingStatus = "Yes";
    guestCount = 1;
    guestCountEl.textContent = guestCount;
    choiceButtons.forEach((btn) => btn.classList.remove("active"));
    document.querySelector('[data-value="Yes"]').classList.add("active");
  } catch (error) {
    showStatus("Something went wrong. Please try again.", "error");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit RSVP";
  }
});

function showStatus(message, type) {
  statusMessage.textContent = message;
  statusMessage.className = `status-message ${type}`;
}
