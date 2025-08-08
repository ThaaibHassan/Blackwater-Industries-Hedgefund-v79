// Myfxbook API Integration
// Documentation: https://www.myfxbook.com/api

export interface MyfxbookAccount {
  id: string;
  name: string;
  accountNumber: string;
  broker: string;
  balance: number;
  equity: number;
  margin: number;
  freeMargin: number;
  profit: number;
  status: 'active' | 'inactive' | 'suspended';
  type: 'demo' | 'live' | 'cent';
  currency: string;
  leverage: number;
  lastLogin: string;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  totalProfit: number;
  openPositions: number;
  openProfit: number;
  pips: number;
}

export interface MyfxbookTrade {
  id: string;
  accountId: string;
  symbol: string;
  side: 'buy' | 'sell';
  lots: number;
  openPrice: number;
  closePrice?: number;
  openTime: string;
  closeTime?: string;
  profit: number;
  pips: number;
  commission: number;
  swap: number;
  status: 'open' | 'closed';
}

export interface MyfxbookOrder {
  id: string;
  accountId: string;
  symbol: string;
  type: 'buy' | 'sell' | 'buy_limit' | 'sell_limit' | 'buy_stop' | 'sell_stop';
  lots: number;
  price: number;
  stopLoss?: number;
  takeProfit?: number;
  openTime: string;
  expiration?: string;
}

export interface MyfxbookDailyGain {
  date: string;
  value: number;
  profit: number;
}

export interface MyfxbookCommunityOutlook {
  symbols: Array<{
    name: string;
    shortPercentage: number;
    longPercentage: number;
    shortVolume: number;
    longVolume: number;
    longPositions: number;
    shortPositions: number;
    totalPositions: number;
    avgShortPrice: number;
    avgLongPrice: number;
  }>;
  general: {
    demoAccountsPercentage: number;
    realAccountsPercentage: number;
    profitablePercentage: number;
    nonProfitablePercentage: number;
    fundsWon: string;
    fundsLost: string;
    averageDeposit: string;
    averageAccountProfit: string;
    averageAccountLoss: string;
    totalFunds: string;
  };
}

export interface MyfxbookDailyData {
  date: string;
  balance: number;
  pips: number;
  lots: number;
  floatingPL: number;
  profit: number;
  growthEquity: number;
  floatingPips: number;
}

class MyfxbookApiService {
  private baseUrl = 'https://www.myfxbook.com/api';
  private sessionId: string | null = null;

  // Authentication
  async login(email: string, password: string): Promise<{ session: string; error: boolean; message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/login.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
      });

      const data = await response.json();
      
      if (!data.error && data.session) {
        this.sessionId = data.session;
      }

      return data;
    } catch (error) {
      console.error('Myfxbook login error:', error);
      return {
        session: '',
        error: true,
        message: 'Network error during login',
      };
    }
  }

  async logout(): Promise<{ error: boolean; message: string }> {
    if (!this.sessionId) {
      return { error: true, message: 'No active session' };
    }

    try {
      const response = await fetch(`${this.baseUrl}/logout.json?session=${this.sessionId}`);
      const data = await response.json();
      
      if (!data.error) {
        this.sessionId = null;
      }

      return data;
    } catch (error) {
      console.error('Myfxbook logout error:', error);
      return { error: true, message: 'Network error during logout' };
    }
  }

  // Account Management
  async getMyAccounts(): Promise<{ accounts: MyfxbookAccount[]; error: boolean; message: string }> {
    if (!this.sessionId) {
      return { accounts: [], error: true, message: 'No active session' };
    }

    try {
      const response = await fetch(`${this.baseUrl}/get-my-accounts.json?session=${this.sessionId}`);
      const data = await response.json();
      
      if (!data.error) {
        return {
          accounts: data.accounts || [],
          error: false,
          message: '',
        };
      }

      return { accounts: [], error: true, message: data.message || 'Failed to fetch accounts' };
    } catch (error) {
      console.error('Myfxbook get accounts error:', error);
      return { accounts: [], error: true, message: 'Network error fetching accounts' };
    }
  }

  async getWatchedAccounts(): Promise<{ accounts: MyfxbookAccount[]; error: boolean; message: string }> {
    if (!this.sessionId) {
      return { accounts: [], error: true, message: 'No active session' };
    }

    try {
      const response = await fetch(`${this.baseUrl}/get-watched-accounts.json?session=${this.sessionId}`);
      const data = await response.json();
      
      if (!data.error) {
        return {
          accounts: data.accounts || [],
          error: false,
          message: '',
        };
      }

      return { accounts: [], error: true, message: data.message || 'Failed to fetch watched accounts' };
    } catch (error) {
      console.error('Myfxbook get watched accounts error:', error);
      return { accounts: [], error: true, message: 'Network error fetching watched accounts' };
    }
  }

  // Trading Data
  async getOpenTrades(accountId: string): Promise<{ trades: MyfxbookTrade[]; error: boolean; message: string }> {
    if (!this.sessionId) {
      return { trades: [], error: true, message: 'No active session' };
    }

    try {
      const response = await fetch(`${this.baseUrl}/get-open-trades.json?session=${this.sessionId}&id=${accountId}`);
      const data = await response.json();
      
      if (!data.error) {
        return {
          trades: data.trades || [],
          error: false,
          message: '',
        };
      }

      return { trades: [], error: true, message: data.message || 'Failed to fetch open trades' };
    } catch (error) {
      console.error('Myfxbook get open trades error:', error);
      return { trades: [], error: true, message: 'Network error fetching open trades' };
    }
  }

  async getOpenOrders(accountId: string): Promise<{ orders: MyfxbookOrder[]; error: boolean; message: string }> {
    if (!this.sessionId) {
      return { orders: [], error: true, message: 'No active session' };
    }

    try {
      const response = await fetch(`${this.baseUrl}/get-open-orders.json?session=${this.sessionId}&id=${accountId}`);
      const data = await response.json();
      
      if (!data.error) {
        return {
          orders: data.orders || [],
          error: false,
          message: '',
        };
      }

      return { orders: [], error: true, message: data.message || 'Failed to fetch open orders' };
    } catch (error) {
      console.error('Myfxbook get open orders error:', error);
      return { orders: [], error: true, message: 'Network error fetching open orders' };
    }
  }

  async getHistory(accountId: string): Promise<{ history: MyfxbookTrade[]; error: boolean; message: string }> {
    if (!this.sessionId) {
      return { history: [], error: true, message: 'No active session' };
    }

    try {
      const response = await fetch(`${this.baseUrl}/get-history.json?session=${this.sessionId}&id=${accountId}`);
      const data = await response.json();
      
      if (!data.error) {
        return {
          history: data.history || [],
          error: false,
          message: '',
        };
      }

      return { history: [], error: true, message: data.message || 'Failed to fetch history' };
    } catch (error) {
      console.error('Myfxbook get history error:', error);
      return { history: [], error: true, message: 'Network error fetching history' };
    }
  }

  // Analytics
  async getDailyGain(accountId: string, startDate: string, endDate: string): Promise<{ dailyGain: MyfxbookDailyGain[]; error: boolean; message: string }> {
    if (!this.sessionId) {
      return { dailyGain: [], error: true, message: 'No active session' };
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/get-daily-gain.json?session=${this.sessionId}&id=${accountId}&start=${startDate}&end=${endDate}`
      );
      const data = await response.json();
      
      if (!data.error) {
        return {
          dailyGain: data.dailyGain || [],
          error: false,
          message: '',
        };
      }

      return { dailyGain: [], error: true, message: data.message || 'Failed to fetch daily gain' };
    } catch (error) {
      console.error('Myfxbook get daily gain error:', error);
      return { dailyGain: [], error: true, message: 'Network error fetching daily gain' };
    }
  }

  async getGain(accountId: string, startDate: string, endDate: string): Promise<{ value: number; error: boolean; message: string }> {
    if (!this.sessionId) {
      return { value: 0, error: true, message: 'No active session' };
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/get-gain.json?session=${this.sessionId}&id=${accountId}&start=${startDate}&end=${endDate}`
      );
      const data = await response.json();
      
      if (!data.error) {
        return {
          value: data.value || 0,
          error: false,
          message: '',
        };
      }

      return { value: 0, error: true, message: data.message || 'Failed to fetch gain' };
    } catch (error) {
      console.error('Myfxbook get gain error:', error);
      return { value: 0, error: true, message: 'Network error fetching gain' };
    }
  }

  async getDailyData(accountId: string, startDate: string, endDate: string): Promise<{ dataDaily: MyfxbookDailyData[]; error: boolean; message: string }> {
    if (!this.sessionId) {
      return { dataDaily: [], error: true, message: 'No active session' };
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/get-data-daily.json?session=${this.sessionId}&id=${accountId}&start=${startDate}&end=${endDate}`
      );
      const data = await response.json();
      
      if (!data.error) {
        return {
          dataDaily: data.dataDaily || [],
          error: false,
          message: '',
        };
      }

      return { dataDaily: [], error: true, message: data.message || 'Failed to fetch daily data' };
    } catch (error) {
      console.error('Myfxbook get daily data error:', error);
      return { dataDaily: [], error: true, message: 'Network error fetching daily data' };
    }
  }

  // Community Sentiment
  async getCommunityOutlook(): Promise<{ communityOutlook: MyfxbookCommunityOutlook; error: boolean; message: string }> {
    if (!this.sessionId) {
      return { communityOutlook: { symbols: [], general: {} as any }, error: true, message: 'No active session' };
    }

    try {
      const response = await fetch(`${this.baseUrl}/get-community-outlook.json?session=${this.sessionId}`);
      const data = await response.json();
      
      if (!data.error) {
        return {
          communityOutlook: {
            symbols: data.symbols || [],
            general: data.general || {},
          },
          error: false,
          message: '',
        };
      }

      return { 
        communityOutlook: { symbols: [], general: {} as any }, 
        error: true, 
        message: data.message || 'Failed to fetch community outlook' 
      };
    } catch (error) {
      console.error('Myfxbook get community outlook error:', error);
      return { 
        communityOutlook: { symbols: [], general: {} as any }, 
        error: true, 
        message: 'Network error fetching community outlook' 
      };
    }
  }

  async getCommunityOutlookByCountry(symbol: string): Promise<{ countries: any[]; error: boolean; message: string }> {
    if (!this.sessionId) {
      return { countries: [], error: true, message: 'No active session' };
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/get-community-outlook-by-country.json?session=${this.sessionId}&symbol=${symbol}`
      );
      const data = await response.json();
      
      if (!data.error) {
        return {
          countries: data.countries || [],
          error: false,
          message: '',
        };
      }

      return { countries: [], error: true, message: data.message || 'Failed to fetch country outlook' };
    } catch (error) {
      console.error('Myfxbook get country outlook error:', error);
      return { countries: [], error: true, message: 'Network error fetching country outlook' };
    }
  }

  // Widget Generation
  getCustomWidgetUrl(accountId: string, options: {
    width?: number;
    height?: number;
    bgcolor?: string;
    chartbgc?: string;
    gridcolor?: string;
    linecolor?: string;
    barcolor?: string;
    fontcolor?: string;
    bart?: number;
    linet?: number;
    charttitle?: string;
    titles?: number;
  } = {}): string {
    if (!this.sessionId) {
      return '';
    }

    const params = new URLSearchParams({
      session: this.sessionId,
      id: accountId,
      width: (options.width || 300).toString(),
      height: (options.height || 200).toString(),
      bgColor: options.bgcolor || '000000',
      gridColor: options.gridcolor || 'BDBDBD',
      lineColor: options.linecolor || '00CB05',
      barColor: options.barcolor || 'FF8D0A',
      fontColor: options.fontcolor || 'FFFFFF',
      title: options.charttitle || '',
      titles: (options.titles || 20).toString(),
      chartbgc: options.chartbgc || '474747',
      bart: (options.bart || 1).toString(),
      linet: (options.linet || 0).toString(),
    });

    return `https://widgets.myfxbook.com/api/get-custom-widget.png?${params.toString()}`;
  }

  // Session Management
  getSessionId(): string | null {
    return this.sessionId;
  }

  isAuthenticated(): boolean {
    return this.sessionId !== null;
  }
}

export const myfxbookApi = new MyfxbookApiService(); 