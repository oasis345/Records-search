export interface Match {
  description: string;
  type: string; // Identifier for this object type ("match")
  id: string; // Match ID
  user: Participant;
  included: any[];
  attributes: {
    createdAt: string; // Time this match object was stored in the API
    duration: number; // Length of the match measured in seconds
    matchType: string; // Type of match
    gameMode: string; // Game mode played
    mapName: string; // Map name
    isCustomMatch: boolean; // True if this match is a custom match
    patchVersion: string; // N/A
    seasonState: string; // The state of the season
    shardId: string; // Platform shard
    stats: {
      description: string; // N/A
    };
    tags: {
      description: string; // N/A
    };
    titleId: string; // Identifies the studio and game
  };
  relationships: {
    description: string; // References to resource objects that can be found in the included array
    assets: {
      data: {
        type: string; // Identifier for this object type ("asset")
        id: string; // Asset ID - Used to find the full asset object in the included array
      }[];
    };
    rosters: {
      data: {
        type: string; // Identifier for this object type ("roster")
        id: string; // Roster ID - Used to find the full roster object in the included array
      }[];
    };
    rounds: {
      description: string; // N/A
    };
    spectators: {
      description: string; // N/A
    };
  };
  links: {
    schema: string; // N/A
    self: string; // Link to this object
  };
}

interface Roster {
  description: string;
  type: string; // Identifier for this object type ("roster")
  id: string; // A randomly generated ID assigned to this resource object for linking elsewhere in the match response
  attributes: {
    shardId: string; // Platform shard
    stats: {
      rank: number; // This roster's placement in the match
      teamId: number; // An arbitrary ID assigned to this roster
    };
    won: string; // Indicates if this roster won the match
  };
  relationships: {
    participants: {
      description: string; // An array of references to participant objects that can be found in the included array
      data: {
        type: string; // Identifier for this object type ("participant")
        id: string; // Participant ID - Use to find full participant object in the included array
      }[];
    };
    team: {
      description: string; // N/A
    };
  };
}

export interface Participant {
  description: string;
  type: string; // Identifier for this object type ("participant")
  id: string; // A randomly generated ID assigned to this resource object for linking elsewhere in the match response
  attributes: {
    actor: string; // N/A
    shardId: string; // Platform shard
    stats: {
      description: string; // Player stats in the context of a match
      DBNOs: number; // Number of players knocked
      assists: number; // Number of enemy players this player damaged that were killed by teammates
      boosts: number; // Number of boost items used
      damageDealt: number; // Total damage dealt. Note: Self inflicted damage is subtracted
      deathType: string; // The way by which this player died, or alive if they didn't
      headshotKills: number; // Number of enemy players killed with headshots
      heals: number; // Number of healing items used
      killPlace: number; // This player's rank in the match based on kills
      killStreaks: number; // Total number of kill streaks
      kills: number; // Number of enemy players killed
      longestKill: number; // Total distance traveled in vehicles measured in meters
      name: string; // PUBG IGN of the player associated with this participant
      playerId: string; // Account ID of the player associated with this participant
      revives: number; // Number of times this player revived teammates
      rideDistance: number; // Total distance traveled in vehicles measured in meters
      roadKills: number; // Number of kills while in a vehicle
      swimDistance: number; // Total distance traveled while swimming measured in meters
      teamKills: number; // Number of times this player killed a teammate
      timeSurvived: number; // Amount of time survived measured in seconds
      vehicleDestroys: number; // Number of vehicles destroyed
      walkDistance: number; // Total distance traveled on foot measured in meters
      weaponsAcquired: number; // Number of weapons picked up
      winPlace: number; // This player's placement in the match
    };
  };
}

interface Asset {
  description: string;
  type: string; // Identifier for this object type ("asset")
  id: string; // A randomly generated ID assigned to this resource object for linking elsewhere in the match response
  attributes: {
    URL: string; // Link to the telemetry.json file
    createdAt: string; // Time of telemetry creation
    description: string; // N/A
    name: string; // Telemetry
  };
}

export interface Season {
  type: string;
  id: string;
  attributes: {
    isCurrentSeason: boolean;
    isOffsetSeason: boolean;
  };
}
